define(['jquery', 'canvas/canvas.class', 'canvas/canvas.view', 'data.class'],
	function ($, canvas, canvasView, data) {
		'use strict';

		return $.extend(true, {
			$stage: null,
			stageId: 'container',
			config: {
				stage: {
					width: $(window).innerWidth(),
					height: $(window).innerHeight(),
					hoverCursor: 'pointer',
					centeredScaling: false,
					selection: true
				},
				grid: {
					lineWidth: 3000,
					lineHeight: 2520,
					cellSize: 50,
					fill: 'black',
					stroke: 'black',
					strokeWidth: 1,
					opacity: 0.2,
					selectable: false,
					contextMenu: false
				},
				default: {
					left: 289,
					top: 100,
					fill: 'rgb(255,128,128)',
					width: 90,
					height: 150,
					contextMenu: true,
					hasControls: false
				}
			},

			init: function() {
				this._initStage();

				if (!this.$stage) {
					this._defaultStage();
				}
				canvasView.init({$stage: this.$stage});
			},

			_defaultStage: function () {
				var rect;

				this.$stage = this.stage(this.stageId);
				this.grid(this.$stage);
				rect = this.rect(this.config.default);
				this.$stage.add(rect);
			},

			_initStage: function () {
				var stageJSON = data.get('stage');

				if (stageJSON) {
					this.$stage = this.stage(this.stageId);
					this._loadStage(stageJSON);
				}
			},

			grid: function (stage, config) {

				config = $.extend(true, this.config.grid, config);

				for (var i = 0; i < config.lineWidth + 1; i += config.cellSize) {
					var hLine = this.line([i, 0, i, config.lineHeight], config);
					stage.add(hLine);
				}

				for (var j = 0; j < config.lineHeight + 1; j += config.cellSize) {
					var vLine = this.line([0, j, config.lineWidth, j], config);
					stage.add(vLine);
				}
			}
		}, canvas);
	});
