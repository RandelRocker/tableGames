define(['jquery', 'model/model.object', 'fabric'],
	function ($, Obj, fabric) {
		'use strict';

		var ObjView = Backbone.View.extend({

			el: 'body',

			initialize: function(config){
				this.model = new Obj();
				this.model.set(config);
			},

			render: function() {
				if (this.model.get('type') === 'Line') {
					return new fabric[this.model.get('type')](this.model.get('coord'), this.model.toJSON());
				}
				return new fabric[this.model.get('type')](this.model.toJSON());
			}
		});

		return ObjView;
	});
