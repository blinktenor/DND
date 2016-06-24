/**
 * Gets an array of the values from the json object
 * @param jsonObj json object to be parsed
 * @returns array
 */
function getArrayFromJSON(jsonObj) {
    var array = [];
    var keys = Object.keys(jsonObj);
    for (var a = 0; a < keys.length; a++) {
        array.push(jsonObj[keys[a]]);
    }
    return array;
}

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffleArray(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

module.exports = {
    getArrayFromJSON: getArrayFromJSON,
    shuffleArray: shuffleArray
};
