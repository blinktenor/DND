var dateFormat = require('dateformat');
var express = require('express');
var router = express.Router();
var http = require('http');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

/* GET DND page. */
router.get('/DND/:param', function (req, res, next) {
    if (req.params['param'].indexOf('.html') > -1) {
        res.render('DND/' + req.params['param']);
    } else {
        res.render('DND/character.html', {character: req.params['param']});
    }
});

router.get('/DND/source/loadGear', function (req, res, next) {
    fs = require('fs');
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
    var dir = process.cwd() + '/public/DND/source/characters/';
    var charDir = fs.readdirSync(dir);
    charDir.sort(function (a, b) {
        return fs.statSync(dir + a).mtime.getTime() -
                fs.statSync(dir + b).mtime.getTime();
    });
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
    if (name === "" || name === undefined) {
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
    fs = require('fs');
    var charDir = fs.readdirSync(process.cwd() + '/public/DND/source/characters/');
    charDir.sort();
    charDir.reverse();
    res.send(charDir.join("~"));
});

router.post('/DND/source/save', function (req, res, next) {

    var now = new Date();
    var name = req.body.name;
    fs = require('fs');
    fs.writeFile(process.cwd() + '/public/DND/source/characters/' + name + dateFormat(now, "ddmmyyyyhhMM") + ".char.txt",
            JSON.stringify(req.body), function (err) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.send("Character Saved!");
        }
    });
});

router.post('/DND/source/saveDm', function (req, res, next) {
    console.log("called");
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

router.post('/DND/source/psdUpload', upload.any(), function (req, res, next) {

    var layers = 0;
    var PSD = require('psd');
    var file = req.files[0];
    var fs = require('fs');
    var fileName = 'uploads/' + file.originalname;
    var originalName = file.originalname;
    var imageSet = [];
    fs.rename(file.path, fileName, function (err) {
        if (err) {
            console.log('ERROR: ' + err);
            res.sendStatus(500);
        } else {
            fs.mkdir(process.cwd() + '/public/DND/images/master/' + originalName, function () {
                if (err) {
                    console.log('ERROR: ' + err);
                    res.sendStatus(500);
                } else {
                    var psd = PSD.fromFile(fileName);
                    psd.parse();
                    var tree = psd.tree();
                    for (var childNum = 0; childNum < tree.descendants().length; childNum++) {
                        var child = tree.descendants()[childNum];
                        layers++;
                        var imageData = {name: child.name, top: child.top, left: child.left, height: child.height, width: child.width};
                        imageSet.push(imageData);
                        child.layer.image.saveAsPng(process.cwd() + '/public/DND/images/master/' + originalName + "/" + child.name + '.png')
                                .then(function () {
                                    layers--;
                                    if (layers === 0) {
                                        offsetLayers(originalName, imageSet);
                                    }
                                });
                    }
                    res.sendStatus(200);
                }
            });
        }

    });
});

function offsetLayers(originalName, imageSet) {
    for (var a = 0; a < imageSet.length; a++) {
        offsetLayer(originalName, imageSet[a]);
    }
}

function offsetLayer(originalName, layerData) {
    var jimp = require('jimp');
    jimp.read(process.cwd() + '/public/DND/images/master/' + originalName + "/" + layerData.name + '.png', function (err, layer) {
        if (err)
            throw err;
        var image = new jimp(layerData.width + layerData.left,
                layerData.height + layerData.top,
                function (err, image) {
                    if (err)
                        throw err;
                });
        image.composite(layer, layerData.left, layerData.top)
                .write(process.cwd() + '/public/DND/images/master/' + originalName + "/" + layerData.name + '.png');
    });
}

router.get('/DND/source/psdFolders', function (req, res, next) {
    fs = require('fs');
    var psdDir = fs.readdirSync(process.cwd() + '/public/DND/images/master/');
    psdDir.sort();
    psdDir.reverse();
    res.send(psdDir.join("~"));
});

router.post('/DND/source/psdImages', function (req, res, next) {
    var folder = req.body.folder;
    fs = require('fs');
    var psdDir = fs.readdirSync(process.cwd() + '/public/DND/images/master/' + folder + "/");
    psdDir.sort();
    psdDir.reverse();
    res.send(psdDir.join("~"));
});

router.all('/DND/source/test', upload.any(), function (req, res, next) {
    var output = "";

    var PSD = require('psd');
    var file = req.files[0];

    var fs = require('fs');
    var fileName = 'uploads/' + file.originalname;
    fs.rename(file.path, fileName, function (err) {
        if (err) {
            console.log('ERROR: ' + err);
            res.sendStatus(500);
        } else {
            fs.mkdir(process.cwd() + '/public/DND/images/master/' + file.originalname, function () {
                if (err) {
                    console.log('ERROR: ' + err);
                    res.sendStatus(500);
                } else {
                    var psd = PSD.fromFile(fileName);
                    psd.parse();
                    var tree = psd.tree();
                    for (var childNum = 0; childNum < tree.descendants().length; childNum++) {
                        var child = tree.descendants()[childNum];
                        child.layer.image.saveAsPng(process.cwd() + '/public/DND/images/master/' + file.originalname + "/" + child.name + '.png');
                        output += ", " + file.originalname + "/" + child.name + ".png";
                    }
                    res.send(output);
                }
            });
        }

    });
});

router.all('/DND/source/layerTest', function (req, res, next) {

    var layers = 0;
    var PSD = require('psd');
    var psd = PSD.fromFile('uploads/mansion.psd');
    psd.parse();
    var tree = psd.tree();
    var originalName = "mansion.psd";
    var imageSet = [];
    for (var childNum = 0; childNum < tree.descendants().length; childNum++) {
        var child = tree.descendants()[childNum];
        layers++;
        var imageData = {name: child.name, top: child.top, left: child.left, height: child.height, width: child.width};
        imageSet.push(imageData);
        child.layer.image.saveAsPng(process.cwd() + '/public/DND/images/master/' + originalName + "/" + child.name + '.png')
                .then(function () {
                    layers--;
                    if (layers === 0) {
                        offsetLayers(originalName, imageSet);
                    }
                });
    }

    res.sendStatus(200);
});

module.exports = router;