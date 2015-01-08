define(['jquery'],
	function($){
		return {
			$elements : {},

			//Find selectors in form
			_assignElements : function () {
				var self = this;

				Object.keys(this.config.selectors)
					.forEach(function (key) {
						self.$elements[key] = $(self.config.selectors[key]);
					});
			},

			//hiding preloader
			hideElement: function(selector, time){
				setTimeout(function(){
					$(selector).hide();
				}, time);
			}

		};
	});
