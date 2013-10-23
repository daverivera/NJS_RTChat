var express = require('express');
var app  = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = 8000;

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
app.use('/js',express.static(__dirname + 'public/js'));
app.use('/css',express.static(__dirname + '/public/css'));

server.listen(port);

var usernames = {};

app.get('/', function (req, res) {
	res.render(__dirname + '/views/index.html');
});


io.sockets.on("connection", function (socket) {
	socket.on("send message", function (data) {
		io.sockets.emit('new message', socket.username, data); //Everyone including me
		// socket.broadcast.emit('new message', data); // Everyone except me
		// socket.emit("new message", data); // Just Me
	});

	socket.on("new user", function (username) {
		socket.username = username;
		usernames[username] = username;
		socket.emit("new message", 'SERVER', "You have connected");
		socket.broadcast.emit("new message", "SERVER", username + ' has connected');
		io.sockets.emit('update users', usernames);
	});

	socket.on("disconnect", function () {
		delete usernames[socket.username];
		io.sockets.emit("update users", usernames);
		socket.broadcast.emit("new message", "SERVER", socket.username + " has disconnected");
	});
});