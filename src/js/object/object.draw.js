define(['jquery', 'canvas/canvas.class', 'data.class'],
	function ($, canvas, data) {
		'use strict';

		return $.extend(true, {
			isDraw: false,
			drawObject: 'none',
			object: null,
			mouseDown: false,
			startX: null,
			startY: null,

			config: {
				default: {
					radius: 2,
					width: 1,
					height: 1,
					selectable: true,
					contextMenu: true,
					hasControls: false,
					centeredScaling: false,
					fill: 'rgb(255,128,128)'
				}
			},

			init: function(config) {
				$.extend(true, this, config);

				this._bindEvents();
			},

			_bindEvents: function() {
				var self = this;

				self._keyPressEvents();
				self._stageEvents();
				self._contextMenuEvents();
			},

			_contextMenuEvents: function() {
				var self = this;

				$(document).on('createObject', function(e, data){
					self.isDraw = true;
					self.drawObject = data.type;
				});
			},

			_keyPressEvents: function() {
				var self = this;

				$(document).on('keyup', function(e) {
					self._removeObject(e)
				});
			},

			_stageEvents: function() {
				var self = this,
					stage = this.$stage;

				stage.on({
					'mouse:down': function (e) {
						self._createObject(e);
					},
					'mouse:move': function (e) {
						self._drawObject(e);
					},
					'mouse:up': function(e){
						self.mouseDown = false;
						self.isDraw = false;
						stage.selection = true;
						data._saveStage(self.$stage);
					}
				});
			},

			_removeObject: function(e) {
				if (e.keyCode == 46) {
					var obj = this._getSelectedObjects();

					obj.forEach(function(key){
						key.remove();
					});

					this.$stage.renderAll();
					data._saveStage(this.$stage);
				}
			},

			_createObject: function(e) {
				var self = this;

				if (!self.isDraw || e.e.button !== 0) {
					return;
				}

				self.mouseDown = true;
				self.$stage.selection = false;
				self._getStartPoint(e.e);
				self._getObject();
				self.$stage.add(self.object);
			},

			_getStartPoint: function(e) {
				var point = this.$stage.getPointer(e);
				this.startX = point.x;
				this.startY = point.y;
			},

			_getObject: function() {
				this.object = this[this.drawObject](
					$.extend(true, {
						left: this.startX,
						top: this.startY
					}, this.config.default));
			},

			_setSize: function(size) {
				switch (this.drawObject) {
					case 'circle':
						this.object.set({radius: size.radius, originX: 'center', originY: 'center'});
						break;
					case 'rect':
						this.object.set({width: size.width, height: size.height});
						break;
					default:
						break;
				}
			},

			_getSize: function(e) {
				var point = this.$stage.getPointer(e),
					rx = Math.abs(this.startX - point.x),
					ry = Math.abs(this.startY - point.y),
					x = this.startX - point.x,
					y = this.startY - point.y,
					radius = rx > ry ? rx : ry;

				return {radius: radius, width: -x, height: -y};
			},

			_drawObject: function (e) {
				var self = this,
					size;

				if (self.isDraw) {
					self.$stage.setCursor('crosshair');
				}

				if (!this.mouseDown || !self.isDraw || !self.object) {
					return;
				}
				size = self._getSize(e.e);
				self._setSize(size);
				self.$stage.renderAll();
			}
		}, canvas);
	});
