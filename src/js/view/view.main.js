define(['jquery', 'view/view.stage', 'view/view.object', 'contextmenu', 'object/object.draw', 'object/object.edit'],
	function ($, StageView, ObjView, menu, draw, edit) {
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
					this.model.set({responseJSON : stageJSON});
					return;
				}

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

		});

		return MainView;
	});