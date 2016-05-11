//this sets all of timer dependent functions to the same intervals to clear on state change

core.factory('TimerFactory', function($rootScope, $interval) {
	var calibrateInt;
	var cursorInt;
	var positionInt;
	var videoInt;

	return {
		startReading: (iterator, delay, callback) => {
			positionInt = $interval(iterator, delay, 0, true, callback);
		},
		moveCursor: (iterator, delay) => {
			cursorInt = $interval(iterator, delay);
		},
		calibrate: (iterator, delay, page) => {
			calibrateInt = $interval(iterator, delay, 0, true, page);
		},
		videoStatus: (iterator, delay) => {
			videoInt = $interval(iterator, delay);
		},
		clearAll: () => {
			$interval.cancel(calibrateInt);
			$interval.cancel(cursorInt);
			$interval.cancel(positionInt);
			$interval.cancel(videoInt);

		},
		clearTracking: () => {
			$interval.cancel(calibrateInt);
			$interval.cancel(cursorInt);
			$interval.cancel(positionInt);
	
		},
		//we know that the webcam is loaded and can start tracking
		videoReady: () => {
			$interval.cancel(videoInt);
			//clearInterval($rootScope.videoInterval);
		},
		calibrationFinished: () => {
			$interval.cancel(calibrateInt);
		}
	}

});