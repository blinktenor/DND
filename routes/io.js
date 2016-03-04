var socketio = require('socket.io');

module.exports.listen = function (server) {
	
	var io = socketio.listen(server);
	
	io.on('connection', function(socket){
	
		socket.on('login', function(name){
			io.emit('dm-login', name);
		});
		
		socket.on('dm-storeOpen', function(storeContents) {
			io.emit('dm-storeOpen', storeContents);
		});

		socket.on('dm-storeClose', function(storeContents) {
			io.emit('dm-storeClose', storeContents);
		});		
	});
	
	return io;
}