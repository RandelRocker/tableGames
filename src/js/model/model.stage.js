define(['jquery', 'backbone'],
	function ($, Backbone) {
		'use strict';

		var Stage = Backbone.Model.extend({

			defaults: {
				$stage: null,
				responseJSON: '',
				stageId: 'container',
				panX: 0,
				panY: 0,
				stageZoom: 20,
				config: {
					width: $(window).innerWidth(),
					height: $(window).innerHeight(),
					hoverCursor: 'pointer',
					centeredScaling: false,
					selection: true
				}
			}
		});

		return Stage;
	});
