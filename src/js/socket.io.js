define(['jquery', 'socket'],
	function($, io){
		var socket = {
			socket: io(),

			bindEvents: function() {
				var self = this;

				$(document).on('saving-stage', function(e, data) {
					self.socket.emit('stage', data.stageJson);
				});

				self.socket.on('stage', function(msg){
					$('body').triggerHandler('stage-response', {json: msg});
				});
			}
		};
		socket.bindEvents();

		return socket;
	});
