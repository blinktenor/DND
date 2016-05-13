(function (angular) {
    'use strict';
    angular.module('services.characters', [])
            .factory('characterService', function () {

    var characters = {};

    return {
        characters: characters
    };
});
})(angular);