define('main', ['jquery', 'canvas', 'data.class'],
	function($, canvas, data){
		var stage,
			layer,
			rect;

		canvas.initStage(function(){
			stage = canvas.stage({
				container: 'container',
				width: canvas.width,
				height: canvas.height,
				draggable: true
			});

			var grid = canvas.grid();

			stage.add(grid);
			layer = canvas.layer();

			rect = canvas.rect({
				x: 289,
				y: 100,
				width: 60,
				height: 150,
				offset: {x:100, y:10},
				fill: '#fff',
				stroke: 'black',
				strokeWidth: 1,
				id: 'test',
				draggable: true
			});

			// add the shape to the layer
			layer.add(rect);

			// add the layer to the stage
			stage.add(layer);

			stage.on('contentMouseup', function(e){
				self.saveStage(stage);
			});
		});
	});
