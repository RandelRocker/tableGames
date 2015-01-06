require.config({
	baseUrl: 'js',
	paths: {
		jade: '../lib/jade/runtime',
		jquery: '../lib/jquery-2.1.1.min',
		fabric: '../lib/fabric'
	},
	shim: {
		'fabric': {
			deps: ['jquery'],
			exports: 'fabric'
		}
	}
});

//start main.js
require(['main']);
