define(['jquery', 'socket.io', 'canvas/canvas.stage', 'canvas/canvas.view', 'contextmenu', 'object/object.draw', 'object/object.edit'],
	function($, socket, stage, canvas, menu, draw, edit){
		stage.init();
		menu.init({$stage: stage.$stage});
		draw.init({$stage: stage.$stage});
		edit.init({$stage: stage.$stage});
	});
