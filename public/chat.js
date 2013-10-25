$(window).ready(function (){
	var socket = io.connect();
	var messageForm = $("#send-message");
	var messageBox = $("#message-input");
	var chat = $("#message-box");

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
		$("#list").empty();
		$.each(data, function (key, value) {
			user = nuevoUser(key);
			$("#list").append(user);
			// $("#users").append('<div>' + key + '</div>');
		});
	});

	var nuevoUser = function (username){
		var user = '<div id="'+ username +'" class="user-item pure-g">';
		user += '<div class="pure-u">';
        user += '<img class="user-avatar" alt="'+ username +'" src="avatar.png" height="64" width="64">';
        user += "</div>";
        user += '<div class="pure-u-3-4">';
        user += '<h5 class="user-name">'+ username +'</h5>';
		user += '<p class="user-last-msg">';
		user += "</p></div></div></div>";
		return user;
	}
});