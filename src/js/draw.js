define(['jquery', 'canvas/canvas.class'],
	function ($, canvas) {
		'use strict';

		return {
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
					fill: 'rgb(255,128,128)'
				}
			},

			init: function(config) {
				$.extend(true, this, config)
			},

			_removeObject: function(e) {
				if (e.keyCode == 46) {
					var obj = [];

					for (var i = 0, len = this.$stage._objects.length; i < len; i++) {
						if(this.$stage._objects[i].active) {
							obj.push(this.$stage._objects[i]);
						}
					}

					obj.forEach(function(key){
						key.remove();
					});

					this.$stage.renderAll();
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
				this.object = canvas[this.drawObject](
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

			_getSize: function(stage, e) {
				var point = stage.getPointer(e),
					rx = Math.abs(this.startX - point.x),
					ry = Math.abs(this.startY - point.y),
					x = this.startX - point.x,
					y = this.startY - point.y,
					radius = rx > ry ? rx : ry;

				return {radius: radius, width: -x, height: -y};
			},

			_drawObject: function (e, stage) {
				var self = this,
					size;

				if (self.isDraw) {
					stage.setCursor('crosshair');
				}

				if (!this.mouseDown || !self.isDraw || !self.object) {
					return;
				}
				size = self._getSize(stage, e.e);
				self._setSize(size);
				stage.renderAll();
			}
		}
	});
