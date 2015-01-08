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

			_createObject: function(e, stage, self) {
				if (!self.isDraw || e.e.button !== 0) {
					return;
				}

				self.mouseDown = true;
				stage.selection = false;
				self._getStartPoint(stage, e.e);
				self._getObject();
				stage.add(self.object);
			},

			_getStartPoint: function(stage, e) {
				var point = stage.getPointer(e);
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

			_drawObject: function (e, stage, self) {
				var size;

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
