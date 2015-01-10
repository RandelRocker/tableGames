define(['jquery', 'data.class', 'canvas/canvas.class'],
	function ($, data, canvas) {
		'use strict';

		return $.extend(true, {

			panX: 0,
			panY: 0,
			stageZoom: 20,

			init: function (config) {
				$.extend(true, this, config);

				this._bindEvents();
				this._loadZoom();
				data._loadPan(this.$stage);
				this.$stage.renderAll();
			},

			_bindEvents: function (stage) {
				var self = this;

				self._stageEvents(stage);
				self._zoomEvents();
				self._panEvents();
				self._socketEvents();
			},

			_socketEvents: function () {
				var self = this;

				$(document).on('stage-response', function (event, data) {
					self.$stage.loadFromJSON(data.json, self.$stage.renderAll.bind(self.$stage));
				})
			},

			_stageEvents: function () {
				var stage = this.$stage;

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

			_zoomEvents: function () {
				$(window).on("DOMMouseScroll", this._mouseWheel.bind(this), false);
				window.onmousewheel = document.onmousewheel = this._mouseWheel.bind(this);
			},

			_panEvents: function () {
				$(window).on('mousedown.canvasPan', this._mouseDown.bind(this));

				$(window).on('mouseup.canvasPan', function (e) {
					$(window).off('mousemove.canvasPan');
				});
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
						zoom = zoom < 0.1 ? 0.1 : zoom;

					this.$stage.setZoom(zoom, {x: event.clientX, y: event.clientY});
					this.$stage.renderAll();
					data._saveZoom(zoom);
					data._savePan(-this.$stage.viewportTransform[4], -this.$stage.viewportTransform[5])
				}
			}
		}, canvas)
	});
