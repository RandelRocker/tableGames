define(['jquery', 'text!templates/menu.html', 'draw'],
	function($, menuHtml, draw){
		'use strict';

		return {
			html: $(menuHtml),
			$stage: null,
			$stageMenu: $(menuHtml).find('#context-menu'),
			$objectMenu: $(menuHtml).find('#object-menu'),

			init: function(config) {
				$.extend(true, this, config);
				this.bindEvents();
			},

			bindEvents: function() {
				var self = this;

				$(document).on('click', '#context-menu a', function(){
					draw.isDraw = true;
					draw.drawObject = $(this).data('type');
					self.$stageMenu.remove();
				})
			},

			menuOpen: function(e) {
				var self = this;

				self.$stageMenu.remove();
				self.$objectMenu.remove();

				if (e.e.button == 2) {
					if (e.target && e.target.contextMenu && e.target.active) {
						console.log(e.target);
						self.$objectMenu.css({'top': e.e.clientY, 'left': e.e.clientX}).appendTo('body');
					} else {
						self.$stageMenu.css({'top': e.e.clientY, 'left': e.e.clientX}).appendTo('body');
					}
				}
			}
		}
	});
