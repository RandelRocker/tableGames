define(['jquery', 'view/view.stage', 'view/view.object', 'view/view.socket', 'contextmenu', 'object/object.draw', 'object/object.edit'],
	function ($, StageView, ObjView, socket, menu, draw, edit) {
		'use strict';

		var MainView = Backbone.View.extend({

			el: 'body',

			initialize: function(){
				this._renderStage();

				menu.init({$stage: this.model.$stage});
				draw.init({$stage: this.model.$stage});
				edit.init({$stage: this.model.$stage});
				this.render();
			},

			render: function() {
				this.model.$stage.renderAll();
			},

			_renderStage: function() {
				var stageView = new StageView();

				this.model = stageView.model;
				this._renderDefault();
			},

			_renderDefault: function() {
				var stageJSON = localStorage.getItem('stage');

				if (stageJSON) {
					socket.model.set({responseJson: stageJSON});
					return;
				}
				this.grid();

				var rect = new ObjView({
					type: 'Rect',
					left: 289,
					top: 100,
					width: 90,
					height: 150
				});

				this.model.$stage.add(rect.render());
			},

			grid: function (stage, config) {

				config = $.extend(true, {
					type: "Line",
					lineWidth: 3000,
					lineHeight: 2520,
					cellSize: 50,
					fill: 'black',
					stroke: 'black',
					strokeWidth: 1,
					opacity: 0.2,
					selectable: false,
					contextMenu: false
				}, config);

				for (var i = 0; i < config.lineWidth + 1; i += config.cellSize) {
					var hLine = new ObjView($.extend(true, {coord: [i, 0, i, config.lineHeight]}, config));
					this.model.$stage.add(hLine.render());
				}

				for (var j = 0; j < config.lineHeight + 1; j += config.cellSize) {
					var vLine = new ObjView($.extend(true, {coord: [0, j, config.lineWidth, j]}, config));
					this.model.$stage.add(vLine.render());
				}
			}

		});

		return MainView;
	});