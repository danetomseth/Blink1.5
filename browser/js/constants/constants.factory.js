core.factory('ConstantsFactory', function($rootScope, Session, SettingsFactory) {
	let calibrateVal = {};

	calibrateVal.blinkRatio = 0.75; //default value
	calibrateVal.blinkZero = 41;

    $rootScope.$on('auth-login-success', function(){
        calibrateVal.blinkRatio = Session.user.blinkRatio
        calibrateVal.blinkZero = Session.user.blinkZero
    })


	calibrateVal.setBlink = (ratio, zero) => {
		calibrateVal.blinkRatio = ratio;
		calibrateVal.blinkZero = zero;
	}


	return calibrateVal;

});
