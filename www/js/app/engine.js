/**
 *	Engine
 *	handles game loop and input
 *	(c) doublespeak games 2015	
 **/
define(['app/util', 'app/event-manager', 'app/graphics', 'app/scene-store'], 
		function(Util, EM, Graphics, SceneStore) {
	
	var _activeScene
	, lastFrame = Util.time()
	;	

	function _changeScene(sceneName) {
		_activeScene = SceneStore.get(sceneName);
		_activeScene.activate();
	}

	
	var _handleInputStart = Util.timeGate(function(e) {
		e = e || window.event;
		// Handle wacky touch event objects
		if(e.changedTouches) {
			e = e.changedTouches[0];
		}

		_activeScene.onInputStart(Graphics.scaleCoords({x: e.pageX, y: e.pageY}));
	}, 10);

	var _handleInputStop = Util.timeGate(function(e) {
		_activeScene.onInputStop();
	}, 10);

	var _handleInputMove = Util.timeGate(function(e) {
		e = e || window.event;
		e.preventDefault();
		// Handle touch events
		if(e.changedTouches) {
			e = e.changedTouches[0];
		}

		_activeScene.onInputMove(Graphics.scaleCoords({x: e.clientX, y: e.clientY}));
	}, 10);

	function _init() {
		// Start everything
		Graphics.init();
		document.body.addEventListener('touchstart', _handleInputStart);
		document.body.addEventListener('mousedown', _handleInputStart);
		document.body.addEventListener('touchstop', _handleInputStop);
		document.body.addEventListener('mouseup', _handleInputStop);
		document.body.addEventListener('touchmove', _handleInputMove);
		document.body.addEventListener('mousemove', _handleInputMove);

		// Start the main menu
		_changeScene('main-menu');

		// Start the gameloop
		(function gameLoop() {
			Util.requestFrame(gameLoop);
			Graphics.clear();
			_activeScene.drawFrame();
		})();
	}

	return {
		init: _init,
		changeScene: _changeScene
	};
});