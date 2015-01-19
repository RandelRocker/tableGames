define(['jquery', 'backbone', 'socket'],
	function ($, Backbone, io) {
		'use strict';

		var Socket = Backbone.Model.extend({

			defaults: {
				socket: io(),
				status: true,
				tempJson: null,
				requestJson: '',
				responseJson: ''
			}
		});

		return new Socket();
	});
