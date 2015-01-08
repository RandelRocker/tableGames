define(['jquery', 'text!templates/menu.html'],
	function($, menuHtml){
		'use strict';

		return {
			html: $(menuHtml),
			$stage: null,
			$stageMenu: $(menuHtml).find('#context-menu'),
			$objectMenu: $(menuHtml).find('#object-menu'),

			initialize: function(stage) {
				this.$stage = stage;
				this.bindEvents();
			},

			bindEvents: function() {
				var self = this;

				self.$stage.on({
					'mouse:down': function (e) {
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
				});

				$(document).on('contextmenu.right-click-menu', function(e) {
					e.preventDefault();
				});
			}
		}
	});
