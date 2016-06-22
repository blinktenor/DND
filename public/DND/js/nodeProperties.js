function prepareProperties() {
    var fs = require('fs');
    fs.access('default.properties', fs.F_OK, function (err) {
        if (err) {
            fs.createReadStream('default.properties_template').pipe(fs.createWriteStream('default.properties'));
        }
    });
    fs.access('hangouts.properties', fs.F_OK, function (err) {
        if (err) {
            fs.createReadStream('hangouts.properties_template').pipe(fs.createWriteStream('hangouts.properties'));
        }
    });
}

module.exports = {
    prepareProperties: prepareProperties
};
