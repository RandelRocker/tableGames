define('canvas', ['jquery', 'kinetic', 'data.class'],
	function ($, Kinetic, data) {
		'use strict';

		return {
			stageId: 'container',
			width: $(window).innerWidth(),
			height: $(window).innerHeight(),

			initStage: function (callback) {
				var stageJSON = data.getStage(),
					stage;

				if (stageJSON) {
					stage = Kinetic.Node.create(stageJSON, this.stageId);
					this.bindStage(stage);

					return stage;
				}

				if ($.isFunction(callback)) callback();
			},

			saveStage: function (stage) {
				data.set('stage', stage.toJSON());
			},

			bindStage: function (stage) {
				var self = this;

				stage.on('contentMouseup', function () {
					self.saveStage(stage)
				});
			},

			stage: function (config) {
				return new Kinetic.Stage(config);
			},

			layer: function (config) {
				return new Kinetic.Layer(config);
			},

			rect: function (config) {
				return new Kinetic.Rect(config);
			},

			line: function (config) {
				return new Kinetic.Line(config);
			}
		}
	});