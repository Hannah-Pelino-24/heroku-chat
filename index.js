var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5555;
var express = require('express');
var users = []

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', function (socket) {
  socket.on('set-online', function (msg) {
    if (!users.includes(msg.username)) {
      io.sockets.emit("register", "true")
    } else {
      io.sockets.emit("register", "false")
    }

  })

  socket.on('save', function (username) {
    users.push(username)
    socket.id = username;

    setInterval(function () {
      socket.emit('onlineUsers', users)
    }, 1000);
  })

  socket.on('chat message', function (msg) {
    socket.broadcast.emit('chatx', msg);
  });

  socket.on('typing', function (username) {
    socket.broadcast.emit('typing', username)
  })

  socket.on('disconnect', function () {
    for (let i = 0; i < users.length; i++) {
      if (users[i] == socket.id) {
        users.splice(i, 1)
      }
    }
  })
});
http.listen(port, function () {
  console.log('listening on *:' + port);
});