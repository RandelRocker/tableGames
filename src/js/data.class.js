define('data.class', ['jquery', 'kinetic'],
	function($, Kinetic){
		'use strict';

		return {
			set: function(key, value) {
				localStorage.setItem(key, value);
			},

			get: function(key) {
				return localStorage.getItem(key);
			},

			getStage: function() {
				return this.get('stage');
			}
		}
	});