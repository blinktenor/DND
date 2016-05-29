var socketio = require('socket.io');

module.exports.listen = function (server) {

    var io = socketio.listen(server);
    var players = {};
    var map;
    var store;

    io.on('connection', function (socket) {

        socket.on('dm-storeOpen', function (storeContents) {
            store = storeContents;
            io.emit('dm-storeOpen', storeContents);
        });

        socket.on('dm-storeClose', function (storeContents) {
            store = undefined;
            io.emit('dm-storeClose', storeContents);
        });

        socket.on('disconnect', function () {
            io.emit('dm-player-update', socket.id);
            if(players[socket.id] !== undefined) delete players[socket.id];
            io.emit('dm-disconnect', players);
        });

        socket.on('player-check', function () {
            if (map !== undefined) io.emit('new-map', map);
            if (store !== undefined) io.emit('dm-storeOpen', store);
        });
        
        socket.on('player-update', function(updateData){
            var data = {};
            data.id = socket.id;
            data.value = updateData;
            io.emit('dm-player-update', data);
            players[data.id] = data.value;
        });
        
        socket.on('map', function(image) {
            map = image;
            io.emit('new-map', image);
        });
    });

    return io;
};