define('canvas', ['jquery', 'fabric', 'data.class'],
	function ($, fabric, data) {
		'use strict';

		return {
			stageId: 'container',
			$stage: null,
			stageZoom: 20,
			panX: 0,
			panY: 0,
			config: {
				stage: {
					width: $(window).innerWidth(),
					height: $(window).innerHeight(),
					hoverCursor: 'pointer',
					centeredScaling: true,
					selection: true
				},
				grid: {
					lineWidth: 3000,
					lineHeight: 2520,
					cellSize: 40,
					fill: 'black',
					stroke: 'black',
					strokeWidth: 1,
					opacity: 0.2,
					selectable: false
				}
			},

			bindEvents: function (stage) {
				var self = this;

				stage.on({
					'object:modified': function (e) {
						e.target.opacity = 1;
						self.saveStage(stage);
					},
					'object:moving': function (e) {
						e.target.opacity = 0.4;
					}
				});

				$(window).on("DOMMouseScroll", this._mouseWheel.bind(this), false);
				window.onmousewheel = document.onmousewheel = this._mouseWheel.bind(this);

				$(window).on('mousedown.canvasPan',this._mouseDown.bind(this));

				$(window).on('mouseup.canvasPan', function(e) {
					$(window).off('mousemove.canvasPan');
				});

				$(document).on('stage-response', function(event, data) {
					self.$stage.loadFromJSON(data.json, self.$stage.renderAll.bind(self.$stage));
				})
			},

			initStage: function (callback) {
				var stageJSON = data.getStageJSON();

				if (stageJSON) {
					this.$stage = this.stage('container');
					this.$stage.loadFromJSON(stageJSON, this.$stage.renderAll.bind(this.$stage));
					this.bindEvents(this.$stage);
					return this.$stage;
				}

				if ($.isFunction(callback)) callback();
			},

			saveStage: function (stage) {
				var stageJson = JSON.stringify(stage.toJSON());

				data.set('stage', stageJson);
				$(document).triggerHandler('saving-stage', {stage: stage, stageJson: stageJson});
			},

			bindStage: function (stage) {
				var self = this;

				stage.on({
					'object:modified': function (e) {
						e.target.opacity = 1;
						self.saveStage(stage)
					},
					'object:moving': function (e) {
						e.target.opacity = 0.4;
					}
				});
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
			},

			stage: function (canvasId, config) {
				config = $.extend(true, this.config.stage, config);
				return new fabric.Canvas(canvasId, config);
			},

			rect: function (config) {
				return new fabric.Rect(config);
			},

			line: function (coord, config) {
				return new fabric.Line(coord, config);
			},

			_mouseDown: function(e) {
				if (e.button != 1) {
					return;
				}

				this.$stage.setCursor('move');
				this.panX = e.clientX - this.$stage.viewportTransform[4];
				this.panY = e.clientY - this.$stage.viewportTransform[5];
				$(window).on('mousemove.canvasPan',this._mouseMove.bind(this));
			},

			_mouseMove: function(e) {
				if (e.button == 1) {
					var dx = this.panX - e.clientX,
						dy = this.panY - e.clientY;
					this.$stage.setCursor('move');
					this.$stage.absolutePan({x: dx, y: dy});
					this.$stage.renderAll.bind(this.$stage);
				}
			},

			_mouseWheel: function (event) {
				var direction = ((event.wheelDelta) ? event.wheelDelta / 120 : event.detail / -3) || false;

				if (direction) {
					event.preventDefault();
					event.returnValue = false;

					var zoom = this.$stage.getZoom() + direction / this.stageZoom;
					this.$stage.setZoom(zoom, {x: event.clientX, y: event.clientY});
					this.$stage.renderAll.bind(this.$stage);
				}
			}
		}
	});