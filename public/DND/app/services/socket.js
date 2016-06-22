(function (angular) {
    'use strict';
    angular.module('services.socket', [])
            .factory('socketService', function () {

    var socket = io();
    var roomName;

    return {
        socket: socket,
        setRoom : function (p_roomName) {
            roomName = p_roomName;
            socket.emit("joinRoom", roomName);
        }
    };
});
})(angular);