require.config({
	baseUrl: 'js',
	paths: {
		jade: '../lib/jade/runtime',
		jquery: '../lib/jquery-2.1.1.min',
		kinetic: '../lib/kinetic/kinetic-v5.1.0',
		fabric: '../lib/fabric/fabric.require'
	},
	shim: {
		'kinetic': {
			deps: ['jquery'],
			exports: 'kinetic'
		}
	}
});

//start main.js
require(['main']);
