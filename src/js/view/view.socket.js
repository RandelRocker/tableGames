define(['jquery', 'model/model.socket'],
	function ($, socket) {
		'use strict';

		var SocketView = Backbone.View.extend({

			el: 'body',

			initialize: function(){
				this.model = socket;
				this.listenTo(this.model, 'change:requestJson', this._sendStageJson.bind(this));
				this.listenTo(this.model, 'change:status', this._checkTempJson.bind(this));
				this.listenTo(this.model, 'change:responseJson', this._triggerResponseEvent.bind(this));
				this.listenTo(this.model.get('socket'), 'stage', this._saveStageJson.bind(this));
			},

			render: function() {

			},

			_sendStageJson: function() {
				localStorage.setItem('stage', this.model.get('requestJson'));
				this.model.get('socket').emit('stage', this.model.get('requestJson'));
			},

			_saveStageJson: function(msg) {
				if (this.model.get('status')) {
					this.model.set({'responseJson': msg});
				} else {
					this.model.set({'tempJson': msg});
				}
			},

			_triggerResponseEvent: function() {
				this.model.trigger('response:stage');
			},

			_checkTempJson: function() {
				if (this.model.get('tempJson') && this.model.get('status')) {
					this.model.set({'responseJson': this.model.get('tempJson')});
				}
			},

			_toggleStatus: function() {
				this.model.set('status', !this.model.get('status'));
			}
		});

		return new SocketView();
	});
