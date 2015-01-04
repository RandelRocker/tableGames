require(['jquery', 'kinetic'],
	function($, Kinetic){
		var stage = new Kinetic.Stage({
			container: 'container',
			width: $(window).innerWidth(),
			height: $(window).innerHeight(),
			draggable: true
		});
		var layer = new Kinetic.Layer();

		var rect = new Kinetic.Rect({
			x: 289,
			y: 100,
			width: 60,
			height: 150,
			offset: {x:100, y:10},
			fill: '#fff',
			stroke: 'black',
			strokeWidth: 1,
			draggable: true
		});

		// add the shape to the layer
		layer.add(rect);

		// add the layer to the stage
		stage.add(layer);

	});
