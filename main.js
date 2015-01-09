var app = require('./server')(),
    io = require('socket.io')(app.http),
    socket = require('./socket')(io);

app.initialize();
socket.initialize();


