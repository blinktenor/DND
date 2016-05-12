angular.module('character').factory('socketService', function () {

    var socket = io();

    return {
        socket: socket
    };
});