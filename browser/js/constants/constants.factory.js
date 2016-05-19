core.factory('ConstantsFactory', function($rootScope, Session, SettingsFactory) {
	let calibrateVal = {};

	calibrateVal.blinkRatio = 0.7; //default value
	calibrateVal.blinkZero = 41;

	calibrateVal.setBlink = (ratio, zero) => {
		calibrateVal.blinkRatio = ratio;
		calibrateVal.blinkZero = zero;
	}

	calibrateVal.increase = () => {
		calibrateVal.blinkRatio = calibrateVal.blinkRatio + 0.02;
	}

	calibrateVal.decrease = () => {
		calibrateVal.blinkRatio = calibrateVal.blinkRatio - 0.02
	}


	return calibrateVal;

});
