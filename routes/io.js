var socketio = require('socket.io');

module.exports.listen = function (server) {
	
	var io = socketio.listen(server);
	
	io.on('connection', function(socket){
		console.log("connection");
	
		socket.on('chat message', function(msg){
			console.log("message");
			io.emit('chat message', msg);
		});
	
		socket.on('login', function(name){
			io.emit('dm-login', name);
		});
	});
	
	return io;
}