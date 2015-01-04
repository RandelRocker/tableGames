require.config({
	baseUrl: 'js',
	paths: {
		jade: '../lib/jade/runtime',
		jquery: '../lib/jquery-2.1.1.min',
		kinetic: '../lib/kinetic/kinetic-v5.1.0.min.js'
	}
});

//start main.js
require(['main']);
