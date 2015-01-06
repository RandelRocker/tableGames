#!/bin/env node
//  OpenShift sample Node application
var express = require('express')(),
    http = require('http').Server(express),
    fs      = require('fs'),
    io      = require('socket.io')(http);


/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        }
    };

    /**
     *  Read dir
     */
    self.readDir = function() {
        var dir = './app/';
        self.files = {};

        fs.readdirSync(dir).forEach(function (file) {
            var stat = fs.statSync(dir + file);

            if(stat.isDirectory()) {
                fs.readdirSync(dir + file).forEach(function (file2) {
                    if (~file2.indexOf('.')) self.files[file2] = '/' + file + '/' + file2;
                })
            } else {
                if (~file.indexOf('.')) self.files[file] = '/' + file;
            }
        });
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };

    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/'] = function(req, res) {
            res.header('Content-Type', 'text/html');
            res.sendFile(__dirname + '/app/index.html');
        };

        Object.keys(self.files)
            .forEach(function (key) {
                var header = (key.indexOf('.css') > -1) ? 'text/css' : 'text/html';

                self.routes[self.files[key]] = function(req, res) {
                    res.header('Content-Type', header);
                    res.sendFile(__dirname + '/app/' + self.files[key]);
                };
            });
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express;

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.readDir();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        http.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */

io.on('connection', function(socket){
    console.log('user connected');
    socket.on('stage', function(msg){
        socket.broadcast.emit('stage', msg);
    });
});

/**
 *  main():  Main code.
 */
var app = new SampleApp();
app.initialize();
app.start();

