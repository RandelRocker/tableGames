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
				/*data.set('stage', stage.toJSON());*/
			},

			bindStage: function (stage) {
				var self = this;

				stage.on('contentMouseup', function () {
					self.saveStage(stage)
				});
			},

			grid: function(config) {
				var gridLayer = this.layer();

				config = {
					width: 2000 || config.width,
					height: 2000 || config.height,
					cellSize: 40 || config.cellSize
				};

				for (var i = 0; i < config.width + 1; i += config.cellSize) {
					var hLine = this.line({
						stroke: "black",
						strokeWidth: .1 || config.strokeWidth,
						points: [i, 0, i, config.height]
					});
					gridLayer.add(hLine);
				}

				for (var j = 0; j < config.height + 1; j += config.cellSize) {
					var vLine = this.line({
						stroke: "black",
						strokeWidth: .1 || config.strokeWidth,
						points: [0, j, config.width, j]
					});
					gridLayer.add(vLine);
				}

				return gridLayer;
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