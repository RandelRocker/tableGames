module.exports = function (io) {
	return {
		io: io,

		initialize: function() {
			this.bindEvents();
		},
		/**
		 *  Define the sample application.
		 */
		bindEvents: function() {
			this.io.on('connection', function(socket){
				console.log('user connected');
				socket.on('stage', function(msg){
					socket.broadcast.emit('stage', msg);
				});
			});
		}
	}
};
