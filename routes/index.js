var dateFormat = require('dateformat');
var express = require('express');
var router = express.Router();
var http = require('http');

/* GET DND page. */
router.get('/DND/:param', function (req, res, next) {
    if (req.params['param'] == "characterSheet.html") {
        res.render('DND/characterSheet.html');
    } else if (req.params['param'] == "store.html") {
        res.render('DND/store.html');
    } else if (req.params['param'] == "dm.html") {
        res.render('DND/dm.html');
    } else if (req.params['param'] == "test.html") {
        res.render('DND/test.html');
    } else if (req.params['param'] == "chat") {
        res.render('DND/chat.html');
    } else if (req.params['param'] == "popup.html") {
        res.render('DND/popup.html');
    } else {
        res.send(req.params['param']);
        console.log(req.params['param']);
    }
});

router.get('/DND/source/loadGear', function (req, res, next) {
    fs = require('fs')
    fs.readFile(process.cwd() + '/public/DND/source/gear.txt', 'utf8', function (err, data) {
        if (err) {
            res.send(err);
            return console.log(err);
        }
        res.send(data);
    });
});

router.post('/DND/source/load', function (req, res, next) {
    var name = req.body.name;
    if (name === "" || name === undefined) {
        res.sendStatus(500);
        return false;
    }
    fs = require('fs');
    var charDir = fs.readdirSync(process.cwd() + '/public/DND/source/characters/');
    charDir.sort();
    charDir.reverse();
    var found = false;
    for (var a = 0; a < charDir.length; a++) {
        if (charDir[a].indexOf(name) > -1 && !found) {
            found = true;
            fs.readFile(process.cwd() + '/public/DND/source/characters/' + charDir[a], 'utf8', function (err, data) {
                if (err) {
                    found = false;
                    res.send(err);
                    return console.log(err);
                } else {
                    res.send(data);
                }
            });
        }
    }
    if (!found) {
        res.sendStatus(500);
    }
});

router.post('/DND/source/loadDm', function (req, res, next) {
    var name = req.body.name;
    if (name == "" || name == undefined) {
        res.sendStatus(500);
    }
    fs = require('fs');
    fs.readFile(process.cwd() + '/public/DND/source/adventures/' + name + '.adventure.txt', 'utf8', function (err, data) {
        if (err) {
            res.send(err);
            return console.log(err);
        }
        res.send(data);
    });
});

router.post('/DND/source/characterNames', function (req, res, next) {
    fs = require('fs')
    var charDir = fs.readdirSync(process.cwd() + '/public/DND/source/characters/');
    charDir.sort();
    charDir.reverse();
    res.send(charDir.join("~"));
});

router.post('/DND/source/save', function (req, res, next) {
    var now = new Date();
    var keys = Object.keys(req.body);
    var name = req.body.name;
    fs = require('fs');

    var output = "";
    for (var a = 0; a < keys.length; a++) {
        output += keys[a] + ":" + req.body[keys[a]] + "~";
    }
    fs.writeFile(process.cwd() + '/public/DND/source/characters/' + name + dateFormat(now, "ddmmyyyyhhMM") + ".char.txt", output, function (err) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus("Character Saved!");
        }
    });
});

router.post('/DND/source/saveDm', function (req, res, next) {
    var now = new Date();
    var keys = Object.keys(req.body);
    var name = req.body.name;
    fs = require('fs');

    var output = "";
    for (var a = 0; a < keys.length; a++) {
        output += keys[a] + ":" + req.body[keys[a]] + "~";
    }
    fs.writeFile(process.cwd() + '/public/DND/source/adventures/' + name + ".adventure.txt", output, function (err) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.send("Adventure Saved!");
        }
    });
});

router.all('/DND/source/test', function (req, res, next) {
    var now = new Date();
    var keys = Object.keys(req.body);
    var name = req.body.name;
    fs = require('fs');

    var output = "";
    for (var a = 0; a < keys.length; a++) {
        output += keys[a] + ":" + req.body[keys[a]] + "~";
    }
    fs.writeFile(process.cwd() + '/public/DND/source/characters/' + name + dateFormat(now, "ddmmyyyyhhMM"), output, function (err) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;