define(['jquery', 'text!templates/menu.html'],
	function($, menuHtml){
		'use strict';

		return {
			html: $(menuHtml),
			$stage: null,
			$stageMenu: $(menuHtml).find('#context-menu'),
			$objectMenu: $(menuHtml).find('#object-menu'),

			init: function(config) {
				$.extend(true, this, config);
				this.$stageMenu.appendTo('body');
				this.$objectMenu.appendTo('body');
				this.bindEvents();
			},

			bindEvents: function() {
				var self = this,
					stage = this.$stage;

				self._preventRightClick();

				$(document).on('click', '#context-menu li', function(){
					self.$stageMenu.hide();
				});

				stage.on({
					'mouse:down': function (e) {
						self.menuOpen(e);
					}
				});
			},

			_preventRightClick: function () {
				$(document).on('contextmenu.right-click-menu', function (e) {
					e.preventDefault();
				});
			},

			menuOpen: function(e) {
				var self = this;

				self.$stageMenu.hide();
				self.$objectMenu.hide();

				if (e.e.button == 2) {
					if (e.target && e.target.contextMenu && e.target.active) {
						console.log(e.target);
						self.$objectMenu.css({'top': e.e.clientY, 'left': e.e.clientX}).show();
					} else {
						self.$stageMenu.css({'top': e.e.clientY, 'left': e.e.clientX}).show();
					}
				}
			}
		}
	});
