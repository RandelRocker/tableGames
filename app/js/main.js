define(['jquery', 'socket.io', 'canvas/canvas.view', 'contextmenu', 'draw'],
	function($, socket, canvas, menu, draw){
		canvas.init();
		menu.init({$stage: canvas.$stage});
		draw.init({$stage: canvas.$stage});
	});
