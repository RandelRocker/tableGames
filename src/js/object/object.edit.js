define(['jquery', 'canvas/canvas.class', 'data.class'],
	function ($, canvas, data) {
		'use strict';

		return $.extend(true, {
			$stage: null,

			init: function(config) {
				$.extend(true, this, config);

				this._bindEvents();
			},

			_bindEvents: function() {
				var self = this;

				$(document).on('editObject', function(e, data){
					var obj = self._getSelectedObjects();

					obj.forEach(function(key){
						key['hasControls'] = !!data.controls;
					});

					self.$stage.renderAll();
				});
			}
		}, canvas);
	});
