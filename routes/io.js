var socketio = require('socket.io');

module.exports.listen = function (server) {

    var io = socketio.listen(server);
    var players = new Map();

    io.on('connection', function (socket) {

        socket.on('login', function (name) {
            players.set(socket, name);
            io.emit('dm-login', name);
        });

        socket.on('dm-storeOpen', function (storeContents) {
            io.emit('dm-storeOpen', storeContents);
        });

        socket.on('dm-storeClose', function (storeContents) {
            io.emit('dm-storeClose', storeContents);
        });

        socket.on('disconnect', function () {
            io.emit('dm-disconnect', players.get(socket));
            players.delete(socket);
        });

        socket.on('player-check', function () {
            if (players.size > 0) {
                var playerIter = players.values();
                var playerNames = [];
                if (playerIter !== null) {
                    var player;
                    do {
                        player = playerIter.next();
                        if (player.value !== undefined) {
                            playerNames.push(player.value);
                        }
                    } while (!player.done);
                }
                io.emit('players', playerNames);
            }
        });
        
        socket.on('player-update', function(updateData){
            io.emit('dm-player-update', updateData);
        });
        
        socket.on('map', function(image) {
            io.emit('new-map', image);
        });
    });

    return io;
};