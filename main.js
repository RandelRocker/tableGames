var app = require('./server')(),
    io = require('socket.io')(app.http),
    socket = require('./socket')(io);

socket.initialize();
app.initialize();

