(function (angular) {
    'use strict';
    angular.module('services.socket', [])
            .factory('socketService', function () {

    var socket = io();

    return {
        socket: socket
    };
});
})(angular);