core.factory('CalibrateFactory', function($rootScope, $state, ConstantsFactory, SettingsFactory, TrackingFactory, PositionFactory) {
    let blinkZero = 0;
    let blinkRatio = 0;
    let maxVals = [];
    let minVals = [];
    let maxSum = 0;
    let minSum = 0;
    let count = 0;
    let frameId = 0;

    let calibrateObj = {};
    calibrateObj.currentValue = 0;
    calibrateObj.blinkCounts = [0,0];

    calibrateObj.blinkStatus = [{'opacity': '0.3'},{'opacity': '0.3'},{'opacity': '0.3'}];

    calibrateObj.calibrationSet = false;
    calibrateObj.startCalibration = false;




    function avgMaxMin(sum) {
        maxSum = 0;
        minSum = 0;
        maxVals.forEach(function(val) {
            maxSum += val;
        })
        maxSum = maxSum / maxVals.length;

        minVals.forEach(function(val) {
            minSum += val;
        })
        minSum = minSum / minVals.length;

        if (sum > maxSum) {
            maxVals.push(sum);
        } else if (sum < minSum) {
            minVals.push(sum);
        }
    }


    function compareValues(total) {
        count++;
        calibrateObj.blinkStatus[2] = {'opacity': '1'};
        calibrateObj.blinkStatus[0] = {'opacity': '1'};
        if (maxVals.length < 50) {
           	calibrateObj.blinkCounts[0] = (maxVals.length / 50) * 100;
        } else {
        	calibrateObj.blinkCounts[0] = 100
        	calibrateObj.blinkStatus[0] = {'opacity': '0.5'};
        }

        if (minVals.length < 50) {
            calibrateObj.blinkCounts[1] = (minVals.length / 50) * 100;
        } else {
        	calibrateObj.blinkCounts[1] = 100
        	calibrateObj.blinkStatus[2] = {'opacity': '0.5'};
        }

        calibrateObj.blinkStatus[1] = {'opacity': '0.5'};
        
        if (maxVals.length > 50 && minVals.length > 50) {
        	calibrateObj.blinkStatus[1] = {'opacity': '1'};

            setValues();
        }

        

        //starting the array - with a little buffer
        if (count > 40 && count < 50) {
            maxVals.push(total + 1);
            minVals.push(total - 1);
        }
        if (count > 50) {
            if (total) {
                avgMaxMin(total);
            }

        }
    };


    //once calibration arrays are full, set values
    let setValues = function() {
        maxVals.forEach(function(val) {
            maxSum += val;
        })
        maxSum = maxSum / maxVals.length;

        minVals.forEach(function(val) {
            minSum += val;
        })
        minSum = minSum / minVals.length;

        blinkZero = maxSum;

        blinkRatio = (minSum / maxSum);
        SettingsFactory.setThreshold(blinkRatio, blinkZero)
        ConstantsFactory.setBlink(blinkRatio, blinkZero);
        calibrateObj.calibrationSet = true;
    }

    calibrateObj.runCalibration = () => {
    	let positions = TrackingFactory.getPositions();
    	if(positions) {
    		compareValues(PositionFactory.getBlinkValue(positions));
    	}
    	if(!calibrateObj.calibrationSet) {
    		frameId = requestAnimationFrame(calibrateObj.runCalibration);
    	}
    }

    return calibrateObj;
});