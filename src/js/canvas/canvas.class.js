define(['jquery', 'fabric', 'data.class'],
	function ($, fabric, data) {
		'use strict';

		return {

			_loadStage: function(stageJSON) {
				this.$stage.loadFromJSON(stageJSON);
			},

			_loadZoom: function() {
				var zoom = data.get('zoom');

				if (zoom) {
					this.$stage.setZoom(zoom);
				}
			},

			stage: function (canvasId, config) {
				config = $.extend(true, this.config.stage, config);
				return new fabric.Canvas(canvasId, config);
			},

			rect: function (config) {
				return new fabric.Rect(config);
			},

			circle: function(config) {
				return new fabric.Circle(config);
			},

			line: function (coord, config) {
				return new fabric.Line(coord, config);
			}
		}
	});