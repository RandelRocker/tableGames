var express = require('express')(),
	http = require('http').Server(express),
	fs = require('fs');

module.exports = function () {
	return {
		files: {},
		routes: {},
		app: express,
		http: http,

		/**
		 *  Initializes the sample application.
		 */
		initialize: function () {
			this.setupVariables();
			this.readDir();
			// Create the express server and routes.
			this.initializeServer();
			this.start();
		},

		/**
		 *  Set up server IP address and port # using env variables/defaults.
		 */
		setupVariables: function () {
			//  Set the environment variables we need.
			this.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
			this.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

			if (typeof this.ipaddress === "undefined") {
				//  Log errors on OpenShift but continue w/ 127.0.0.1 - this
				//  allows us to run/test the app locally.
				console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
				this.ipaddress = "127.0.0.1";
			}
		},

		/**
		 *  Read dir
		 */
		readDir: function () {
			var self = this,
				dir = './app/';

			fs.readdirSync(dir).forEach(function (file) {
				var stat = fs.statSync(dir + file);

				if (stat.isDirectory()) {
					fs.readdirSync(dir + file).forEach(function (file2) {
						if (~file2.indexOf('.')) self.files[file2] = '/' + file + '/' + file2;
					})
				} else {
					if (~file.indexOf('.')) self.files[file] = '/' + file;
				}
			});
		},

		/**
		 *  Create the routing table entries + handlers for the application.
		 */
		createRoutes: function () {
			var self = this;

			self.routes['/'] = function (req, res) {
				res.header('Content-Type', 'text/html');
				res.sendFile(__dirname + '/app/index.html');
			};

			Object.keys(self.files)
				.forEach(function (key) {
					var header = (key.indexOf('.css') > -1) ? 'text/css' : 'text/html';

					self.routes[self.files[key]] = function (req, res) {
						res.header('Content-Type', header);
						res.sendFile(__dirname + '/app/' + self.files[key]);
					};
				});
		},

		/**
		 *  Initialize the server (express) and create the routes and register
		 *  the handlers.
		 */
		initializeServer: function () {
			this.createRoutes();
			//  Add handlers for the app (from the routes).
			for (var r in this.routes) {
				this.app.get(r, this.routes[r]);
			}
		},

		/**
		 *  Start the server (starts up the sample application).
		 */
		start: function () {
			//  Start the app on the specific interface (and port).
			http.listen(this.port, this.ipaddress, function () {
				console.log('%s: Node server started on %s:%d ...',
					Date(Date.now()), this.ipaddress, this.port);
			});
		}
	}
};
