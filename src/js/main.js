define('main', ['jquery', 'canvas', 'data.class'],
	function($, canvas, data){

		canvas.initStage(function(){
			canvas.$stage = canvas.stage('container');

			canvas.grid(canvas.$stage);

			var rect = canvas.rect({
				left: 289,
				top: 100,
				fill: 'rgb(255,128,128)',
				width: 90,
				height: 150,
				strokeWidth: 2,
				hasControls: false
			});

			canvas.bindEvents(canvas.$stage);
			canvas.$stage.add(rect);
		});
	});
