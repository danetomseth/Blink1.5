core.factory('ConstantsFactory', function() {
	let calibrateVal = {};

	calibrateVal.blinkRatio = 0.85; //default value
	calibrateVal.blinkZero = 40;


	calibrateVal.setBlink = (ratio, zero) => {
		console.log('blink val set', ratio);
		calibrateVal.blinkRatio = ratio;
		calibrateVal.blinkZero = zero;
	}


	return calibrateVal;

});