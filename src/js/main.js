define(['jquery', 'socket.io', 'canvas/canvas.stage', 'canvas/canvas.view', 'contextmenu', 'object/draw.object'],
	function($, socket, stage, canvas, menu, draw){
		stage.init();
		canvas.init({$stage: stage.$stage});
		menu.init({$stage: stage.$stage});
		draw.init({$stage: stage.$stage});
	});
