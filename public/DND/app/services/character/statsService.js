(function (angular) {
    'use strict';
    angular.module('services.stats', [])
            .factory('statsService', function () {

    var characterStats = {};
    var scope;
    var http;
    var alerts;

    return {
        characterStats: characterStats,
        setValues : function ($scope, $http, alertService) {
            scope = $scope;
            http = $http;
            alerts = alertService;
        },
        save : function () {

            if (scope.characterStats.name !== "" && scope.characterStats.name !== undefined) {
                http({
                    method: 'POST',
                    url: 'DND/source/save',
                    data: scope.characterStats
                }).then(function successCallback(response) {
                    alerts.alert("Character Saved!", 1);
                });
            } else {
                alerts.alert("Enter character name", 0);
            }
        },
        load : function () {

            if (scope.characterStats.name !== "" && scope.characterStats.name !== undefined) {
                http({
                    method: 'POST',
                    url: 'DND/source/load',
                    data: {name: scope.characterStats.name}
                }).then(function successCallback(response) {
                    angular.copy(response.data, characterStats);
                    alerts.alert("Character Loaded!", 1);
                });
            } else {
                alerts.alert("Enter character name", 0);
            }
        }
    };
});
})(angular);