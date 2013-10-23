$(window).ready(function (){
	var socket = io.connect();
	var messageForm = $("#send-message");
	var messageBox = $("#message");
	var chat = $("#chat");

	messageForm.submit(function (e) {
		e.preventDefault();
		socket.emit('send message', messageBox.val());
		messageBox.val("");
	});


	// socket.on('new message', function (data) {
	// 	chat.append(data + '<br />');
	// });
	socket.on('new message', function (username, data) {
		chat.append("<b>"+ username +"</b>: " + data + '<br />');
	});

	socket.on('connect', function() {
		socket.emit('new user', prompt("What's your name?"));
	});

	socket.on('update users', function (data) {
		$("#users").empty();
		$.each(data, function (key, value) {
			$("#users").append('<div>' + key + '</div>');
		});
	});
});