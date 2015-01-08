define(['jquery', 'text!template/menu.html'],
	function($, menuHtml){
		'use strict';

		return {
			html: menuHtml,

			initialize: function() {},

			bindEvents: function() {
				$(document).on('contextmenu', function(e) {
					e.preventDefault();
				});
			}
		}
	});
