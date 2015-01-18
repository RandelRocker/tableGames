define(['jquery', 'model/model.stage', 'fabric', 'socket.io'],
	function ($, Stage, fabric, io) {
		'use strict';

		var StageView = Backbone.View.extend({

			el: 'body',

			events: {
				'stage-response': '_socketEvents'
			},

			initialize: function(){
				this.model = new Stage();
				this._initStage();
				this._loadZoom();
				this._loadPan();
				this.render();

				window.onmousewheel = document.onmousewheel = this._onMouseWheel.bind(this);
				this.listenTo(this.model.$stage, 'object:modified', this._onObjModified.bind(this));
				this.listenTo(this.model.$stage, 'object:moving', this._onObjMove.bind(this));
				this.listenTo(this.model.$stage, 'mouse:move', this._onMouseMove.bind(this));
				this.listenTo(this.model.$stage, 'mouse:down', this._onMouseDown.bind(this));
				this.listenTo(this.model, 'stage:save', this._saveStage.bind(this));
				this.listenTo(this.model, 'change:responseJSON', this._loadStage.bind(this));
			},

			render: function() {
				this.model.$stage.renderAll();
			},

			_initStage: function () {
				this.model.$stage = new fabric.Canvas(this.model.get('stageId'), this.model.get('config'));
			},

			_saveStage: function () {
				var stageJson = JSON.stringify(this.model.$stage.toJSON());

				localStorage.setItem('stage', stageJson);
				io.socket.emit('stage', stageJson);
			},

			_loadStage: function(model) {
				this.model.$stage.loadFromJSON(model.get('responseJSON'));
				this.render();
			},

			_savePan: function(x, y){
				localStorage.setItem('x', -x);
				localStorage.setItem('y', -y);
			},

			_loadZoom: function() {
				var zoom = localStorage.getItem('zoom');

				if (zoom) {
					this.model.$stage.setZoom(zoom);
				}
			},

			_loadPan: function() {
				var x = +localStorage.getItem('x'),
					y = +localStorage.getItem('y');

				if (x && y) {
					this.model.$stage.viewportTransform[4] = x;
					this.model.$stage.viewportTransform[5] = y;
				}
			},

			_socketEvents: function(event, data) {
				this.model.set({'responseJSON': data.json});
				this.render();
			},

			_onMouseDown: function (e) {
				if (e.e.button != 1) {
					return;
				}

				this.model.set('panX', e.e.clientX - this.model.$stage.viewportTransform[4] || +localStorage.getItem('x'));
				this.model.set('panY', e.e.clientY - this.model.$stage.viewportTransform[5] || +localStorage.getItem('y'));
			},

			_onMouseMove: function (e) {
				if (e.e.button == 1) {
					var dx = this.model.get('panX') - e.e.clientX,
						dy = this.model.get('panY') - e.e.clientY;

					this.model.$stage.setCursor('move');
					this.model.$stage.absolutePan({x: dx, y: dy});
					this.render();
					this._savePan(dx, dy);
				}
			},

			_onObjModified: function(e) {
				e.target.opacity = 1;
				this.model.trigger('stage:save');
			},

			_onObjMove: function(e) {
				e.target.opacity = 0.4;
			},

			_onMouseWheel: function (e) {
				var direction = ((e.wheelDelta) ? e.wheelDelta / 120 : e.detail / -3) || false;

				if (direction) {
					e.preventDefault();
					e.returnValue = false;

					var zoom = this.model.$stage.getZoom() + direction / this.model.get('stageZoom');
					zoom = zoom < 0.1 ? 0.1 : zoom;

					this.model.$stage.setZoom(zoom, {x: e.clientX, y: e.clientY});
					this.render();
					localStorage.setItem('zoom', zoom);
					this._savePan(-this.model.$stage.viewportTransform[4], -this.model.$stage.viewportTransform[5])
				}
			}
		});

		return StageView;
	});
