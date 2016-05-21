'use strict';
var socketio = require('socket.io');
var io = null;
let users = {}

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        // Now have access to socket, wowzers!
        console.log("new connection at", socket.id);

        socket.on('join', function(name){
            socket.name = name;
            users[socket.name] = socket;
            io.emit('updateUsers', Object.keys(users));
        })

        socket.on('chat', function(msg){
            console.log("got", msg);
            io.emit('chat', {msg: msg, user: socket.name});
        });

        socket.on('disconnect', function(){
            delete users[socket.name];
            io.emit('updateUsers', Object.keys(users));
            console.log("post-delete users", users);

        });
    });

    return io;

};
