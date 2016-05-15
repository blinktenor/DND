(function (angular) {
    'use strict';
    angular.module('services.stats', [])
            .factory('statsService', function () {

    var characterStats = {};

    return {
        characterStats: characterStats
    };
});
})(angular);