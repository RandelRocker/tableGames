define('data.class', ['jquery'],
	function($){
		'use strict';

		return {
			set: function(key, value) {
				localStorage.setItem(key, value);
			},

			get: function(key) {
				return localStorage.getItem(key);
			},

			getStageJSON: function() {
				return this.get('stage');
			}
		}
	});