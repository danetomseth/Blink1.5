core.factory('ConstantsFactory', function($rootScope, SettingsFactory) {
	let calibrateVal = {};

	let disableBlink = false;

	$rootScope.$on("userThreshold", (event, data) => {
        console.log('data', data);
        calibrateVal.blinkRatio = data.ratio
		calibrateVal.blinkCalibrated = true;
		calibrateVal.blinkZero = data.zero;
		if(disableBlink) {
			calibrateVal.blinkRatio = 0
		}
    });


	calibrateVal.blinkRatio = 0.5; //default value
	calibrateVal.blinkZero = 45.73;

	calibrateVal.center = [0,0];
	calibrateVal.xThresh = [0,0];
	calibrateVal.yThresh = [0,0];

	calibrateVal.pupilsCalibrated = false;
	calibrateVal.blinkCalibrated = false;

	calibrateVal.setBlink = (ratio, zero) => {
		calibrateVal.blinkRatio = ratio;
		calibrateVal.blinkZero = zero;
		calibrateVal.blinkCalibrated = true;
		console.log('ratio', ratio);
		console.log('zero', zero);
	}


	calibrateVal.setPupil = (center, xThresh, yThresh) => {
		calibrateVal.center = center;
		calibrateVal.xThresh = xThresh;
		calibrateVal.yThresh = yThresh;
		calibrateVal.pupilsCalibrated = true;
	}

	calibrateVal.increase = () => {
		calibrateVal.blinkRatio = calibrateVal.blinkRatio + 0.02;
	}

	calibrateVal.decrease = () => {
		calibrateVal.blinkRatio = calibrateVal.blinkRatio - 0.02
	}


	return calibrateVal;

});
