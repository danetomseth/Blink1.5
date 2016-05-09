//this sets all of timer dependent functions to the same intervals to clear on state change

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
		},
		clearAll: () => {
			clearInterval($rootScope.videoInterval);
			clearInterval($rootScope.calibrateInt);
			clearInterval($rootScope.cursorInt);
			clearInterval($rootScope.readPositionInt);
		},
		//we know that the webcam is loaded and can start tracking
		videoReady: () => {
			clearInterval($rootScope.videoInterval);
		},
		calibrationFinished: () => {
			clearInterval($rootScope.calibrateInt);
		}
	}

});