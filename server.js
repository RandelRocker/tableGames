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
			this.concatDir();
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
			this.port = process.env.PORT || 8080;

			if (typeof this.ipaddress === "undefined") {
				//  Log errors on OpenShift but continue w/ 127.0.0.1 - this
				//  allows us to run/test the app locally.
				this.ipaddress = "127.0.0.1";
			}
		},

		/**
		 *  Concat dir
		 */
		concatDir: function () {
			var self = this,
				dirs = ['/app/', '/app/css/', '/app/js/', '/app/js/canvas/', '/app/lib/'];

			dirs.forEach(function(key) {
				self.readDir(key);
			});
		},

		/**
		 *  Read dir
		 */
		readDir: function(dir) {
			var self = this;

			fs.readdirSync('.' + dir).forEach(function (file) {
				var stat = fs.statSync('.' + dir + file);

				if (!stat.isDirectory()) {
					if (~file.indexOf('.')) self.files[file] = dir.replace('/app/','/') + file;
				}
			})
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
						res.sendFile(__dirname + '/app' + self.files[key]);
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
