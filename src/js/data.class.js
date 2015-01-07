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

			_saveZoom: function(value) {
				this.set('zoom', value);
			},
			_savePan: function(x, y){
				this.set('x', -x);
				this.set('y', -y);
			},

			_loadPan: function(stage) {
				var x = +this.get('x'),
					y = +this.get('y');

				if (x && y) {
					stage.viewportTransform[4] = x;
					stage.viewportTransform[5] = y;
					stage.renderAll();
					for (var i = 0, len = stage._objects.length; i < len; i++) {
						stage._objects[i].setCoords();
					}
				}
			},

			_getStageJson: function(stage) {
				return JSON.stringify(stage.toJSON());
			},

			_saveStage: function (stage) {
				var stageJson = this._getStageJson(stage);

				this.set('stage', stageJson);
				this._fireEvent('saving-stage', {stage: stage, stageJson: stageJson});
			},

			_fireEvent: function(event, data) {
				$(document).triggerHandler(event, data)
			}
		}
	});