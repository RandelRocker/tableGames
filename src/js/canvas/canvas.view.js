define('canvas/canvas.view', ['jquery', 'data.class', 'canvas/canvas.class'],
	function ($, data, canvas) {
		'use strict';

		return $.extend(true, {

			panX: 0,
			panY: 0,
			stageZoom: 20,
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

			init: function() {
				this.initStage();

				if (!this.$stage) {
					this._defaultStage();
				}
				this._bindEvents(this.$stage);
				this._loadZoom();
				data._loadPan(this.$stage);
				this.$stage.renderAll();
			},

			_defaultStage: function() {
				this.$stage = this.stage(this.stageId);
				this.grid(this.$stage);

				var rect = canvas.rect({
					left: 289,
					top: 100,
					fill: 'rgb(255,128,128)',
					width: 90,
					height: 150,
					strokeWidth: 2,
					hasControls: false
				});
				this.$stage.add(rect);
			},

			_bindEvents: function (stage) {
				var self = this;

				self._stageEvents(stage);
				self._zoomEvents();
				self._panEvents();
				self._socketEvents();
			},

			_socketEvents: function() {
				var self = this;

				$(document).on('stage-response', function (event, data) {
					self.$stage.loadFromJSON(data.json, self.$stage.renderAll.bind(self.$stage));
				})
			},

			_stageEvents: function(stage) {
				var self = this;

				stage.on({
					'object:modified': function (e) {
						e.target.opacity = 1;
						data._saveStage(stage);
					},
					'object:moving': function (e) {
						e.target.opacity = 0.4;
					}
				});
			},

			_zoomEvents: function() {
				$(window).on("DOMMouseScroll", this._mouseWheel.bind(this), false);
				window.onmousewheel = document.onmousewheel = this._mouseWheel.bind(this);
			},

			_panEvents: function() {
				$(window).on('mousedown.canvasPan', this._mouseDown.bind(this));

				$(window).on('mouseup.canvasPan', function (e) {
					$(window).off('mousemove.canvasPan');
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

			_mouseDown: function (e) {
				if (e.button != 1) {
					return;
				}

				this.$stage.setCursor('move');
				this.panX = e.clientX - this.$stage.viewportTransform[4] || +data.get('x');
				this.panY = e.clientY - this.$stage.viewportTransform[5] || +data.get('y');
				$(window).on('mousemove.canvasPan', this._mouseMove.bind(this));
			},

			_mouseMove: function (e) {
				if (e.button == 1) {
					var dx = this.panX - e.clientX,
						dy = this.panY - e.clientY;
					this.$stage.setCursor('move');
					this.$stage.absolutePan({x: dx, y: dy});
					this.$stage.renderAll();
					data._savePan(dx, dy);
				}
			},

			_mouseWheel: function (event) {
				var direction = ((event.wheelDelta) ? event.wheelDelta / 120 : event.detail / -3) || false;

				if (direction) {
					event.preventDefault();
					event.returnValue = false;

					var zoom = this.$stage.getZoom() + direction / this.stageZoom;
					this.$stage.setZoom(zoom, {x: event.clientX, y: event.clientY});
					this.$stage.renderAll();
					data._saveZoom(zoom)
					data._savePan(-this.$stage.viewportTransform[4], -this.$stage.viewportTransform[5])
				}
			}
		}, canvas)
	});