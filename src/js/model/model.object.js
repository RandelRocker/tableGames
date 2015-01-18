define(['jquery', 'backbone'],
	function ($, Backbone) {
		'use strict';

		var Object = Backbone.Model.extend({

			defaults: {
				type: null,
				selectable: true,
				contextMenu: true,
				hasControls: false,
				centeredScaling: false,
				fill: 'rgb(255,128,128)'
			}
		});

		return Object;
	});
