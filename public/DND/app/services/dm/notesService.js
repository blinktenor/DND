(function (angular) {
    'use strict';
    angular.module('services.notes', [])
            .factory('notesService', function () {

    var adventure = {};

    return {
        adventure: adventure
    };
});
})(angular);