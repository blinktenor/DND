var socketio = require('socket.io');
var PropertiesReader = require('properties-reader');
var hangouts = PropertiesReader('hangouts.properties');
var ArrayUtils = require('../public/DND/js/ArrayUtils.js');

module.exports.listen = function (server) {

  var io = socketio.listen(server);
  var games = {};
  var allHangouts = ArrayUtils.getArrayFromJSON(hangouts.getAllProperties());
  ArrayUtils.shuffleArray(allHangouts);

  io.on('connection', function (socket) {

    var room;

    socket.on('roomCheck', function (callback) {
      var keys = Object.keys(games);
      for (var a = 0; a < keys.length; a++) {
        if(games[keys[a]].playerCount < 1) {
          closeRoom(keys[a]);
        }
      }
      callback(Object.keys(games));
    });

    socket.on('joinRoom', function (p_room) {
      room = p_room;
      socket.join(room);
      if (games[room] === undefined) {
        openRoom(room);
      }
      games[room].playerCount++;
    });

    socket.on('dm-storeOpen', function (storeContents) {
      store = storeContents;
      socket.in(room).broadcast.emit('dm-storeOpen', storeContents);
    });

    socket.on('dm-storeClose', function () {
      store = undefined;
      socket.in(room).broadcast.emit('dm-storeClose');
    });

    socket.on('disconnect', function () {
      console.log('disconnected');
      if (games[room] !== undefined) {
        console.log('exists');
        var players = games[room].players;
        socket.in(room).broadcast.emit('dm-player-update', socket.id);
        if (players !== undefined && players[socket.id] !== undefined) {
          delete players[socket.id];
        }
        socket.in(room).broadcast.emit('dm-disconnect', players);
        games[room].playerCount--;
        console.log(games[room].playerCount);
        if (games[room].playerCount <= 0) {
          closeRoom(room);
        }
      }
    });

    socket.on('player-check', function (callback) {
      var data = {};
      if (games[room] !== undefined) {
        if (games[room].map !== undefined)
          data.map = games[room].map;
        if (games[room].store !== undefined)
          data.store = games[room].store;
        if (games[room].hangout !== undefined)
          data.hangout = games[room].hangout;
      }
      callback(data);
    });

    socket.on('hangout', function () {
      socket.in(room).broadcast.emit('hangout-url', games[room].hangout);
    });

    socket.on('dm-check', function (callback) {
      if (room !== undefined) {
        if (games[room] !== undefined) {
          var players = games[room].players;
          var keys = Object.keys(players);
          for (var a = 0; a < keys.length; a++) {
            var data = {};
            data.id = keys[a];
            data.value = players[keys[a]];
            socket.in(room).broadcast.emit('dm-player-update', data);
          }
        }
        callback(games[room].hangout);
      }
    });

    socket.on('player-update', function (updateData) {
      if (room !== undefined) {
        var players = games[room].players;
        var data = {};
        data.id = socket.id;
        data.value = updateData;
        socket.in(room).broadcast.emit('dm-player-update', data);
        players[data.id] = data.value;
        games[room].players = players;
      }
    });

    socket.on('map', function (image) {
      games[room].map = image;
      socket.in(room).broadcast.emit('new-map', image);
    });

    function openRoom(room) {
      games[room] = {};
      games[room].players = {};
      games[room].hangout = allHangouts.pop();
      games[room].playerCount = 0;
      io.emit('roomList', Object.keys(games));
    }

    function closeRoom(room) {
      allHangouts.push(games[room].hangout);
      ArrayUtils.shuffleArray(allHangouts);
      delete games[room];
      io.emit('roomList', Object.keys(games));
    }

  });

  return io;
};