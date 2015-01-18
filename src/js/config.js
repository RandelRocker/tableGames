require.config({
	baseUrl: 'js',
	paths: {
		jade: '../lib/jade/runtime',
		jquery: '../lib/jquery-2.1.1.min',
		fabric: '../lib/fabric',
		backbone: '../lib/backbone-min',
		underscore: '../lib/underscore-min',
		socket: '../socket.io/socket.io.js'
	},
	shim: {
		'fabric': {
			deps: ['jquery'],
			exports: 'fabric'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		}
	}
});

//start main.js
require(['main']);
