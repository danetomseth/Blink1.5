core.factory('ConstantsFactory', function($rootScope, Session, SettingsFactory) {
	let calibrateVal = {};

	calibrateVal.blinkRatio = 0.7; //default value
	calibrateVal.blinkZero = 41;

    // $rootScope.$on('auth-login-success', function(){
    //     calibrateVal.blinkRatio = Session.user.blinkRatio
    //     calibrateVal.blinkZero = Session.user.blinkZero
    // })


	calibrateVal.setBlink = (ratio, zero) => {
		calibrateVal.blinkRatio = ratio;
		calibrateVal.blinkZero = zero;
	}

	calibrateVal.increase = () => {
		calibrateVal.blinkRatio = calibrateVal.blinkRatio + 0.02;
		console.log(calibrateVal.blinkRatio);
	}

	calibrateVal.decrease = () => {
		//calibrateVal.blinkRatio = ratio;
		//calibrateVal.blinkZero = zero;
		calibrateVal.blinkRatio = calibrateVal.blinkRatio - 0.02
		console.log(calibrateVal.blinkRatio);
	}


	return calibrateVal;

});
