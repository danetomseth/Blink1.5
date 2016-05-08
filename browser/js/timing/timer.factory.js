core.factory('TimerFactory', function($rootScope) {

	return {
		startReading: (iterator, delay) => {
			$rootScope.readPositionInt = setInterval(iterator, delay);
		},
		moveCursor: (iterator, delay) => {
			$rootScope.cursorInt = setInterval(iterator, delay);
		},
		calibrate: (iterator, delay) => {
			$rootScope.calibrateInt = setInterval(iterator, delay);
		},
		videoStatus: (iterator, delay) => {
			$rootScope.videoInterval = setInterval(iterator, delay);
		}
	}

});