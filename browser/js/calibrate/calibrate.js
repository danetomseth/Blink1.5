core.directive("blCalibrate", function(PositionFactory, IterateFactory, TrackingFactory, ConstantsFactory, $interval, $rootScope) {
    return {
        restrict: "E",
        templateUrl: 'templates/calibrate.html',
        link: function(scope, elem, attr) {

            let blinkCalibrate;
            let calibrationComplete = false;
            let frameId = 0;
            let currentBlink;
            let blinkZero = 0;
            let blinkRatio = 0;
            let maxVals = [];
            let minVals = [];
            let maxSum = 0;
            let minSum = 0;
            let debounce = true;
            let converge = 50000;
            let confirmDebounce = true;
            let zeroFinished = false;

            let count = 0;
            let init = 0;
            let total = 0;
            let start = 0;

            scope.confirmBlink = 5;
            scope.maxCount = 50;
            scope.minCount = 50;

            scope.showMessage = false;

            scope.leftEye = 0;
            scope.rightEye = 0;



            function blinkDelay() {
                
                setTimeout(function() {
                    debounce = true;
                    scope.blinkReady = {
                        'color': 'black'
                    }
                }, 500)
            }

            function confirmDelay() {
            	if (scope.confirmBlink > 0) {
                    scope.confirmBlink--;
                }
                else if(scope.confirmBlink === 0) {
                    scope.end()
                }
                setTimeout(function() {
                    confirmDebounce = true;
                    scope.confirmBox = {
                        'border': 'none'
                    }
                }, 500)
            }


            function testDelay() {
                setTimeout(function() {
                    scope.confirmBlink = 5;
                    scope.showMessage = true;
                    scope.message = "Keep Settings?"
                }, 7500)
            }



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
           

            function compareValues(vals) {
                total = vals[0] + vals[1];
                count++;
                scope.blinkReady = {
                    'opacity': '0.5'
                }
                if (maxVals.length > 50 && minVals.length > 50) {
                    scope.calibrationFinished();
                    scope.blinkReady = {
                    'opacity': '1'
                	}
                }

                // not that important

                if (maxVals.length <= 50) {
                    scope.maxCount = (50 - maxVals.length);
                } else {
                    scope.maxReady = {
                        'opacity': '0.5'
                    }
                }

                if (minVals.length <= 50) {
                    scope.minCount = (50 - minVals.length);
                } else {
                    scope.minReady = {
                        'opacity': '0.5'
                    }
                }
                /// to here

                //starting the array - with a little buffer
                if (count > 40 && count < 50) {
                    maxVals.push(total + 1);
                    minVals.push(total - 2);
                    // maxVals.push(total);
                    // minVals.push(total);
                }
                if (count > 50) {
                    if (total) {
                        avgMaxMin(total);
                    }

                }
            };


            function readEyes(timestamp) {
                scope.$digest()
               
                let positions = TrackingFactory.getPositions()
                if (positions) {
                    currentBlink = PositionFactory.getBlinkValue(positions)
                }

                if (converge > 0.5 && !zeroFinished) {
                    $rootScope.zeroActive = true;
                    converge = TrackingFactory.convergence();
                    if(converge <= 0.5) {
                        zeroFinished = true;
                        $rootScope.zeroActive = false;
                        $rootScope.$digest();
                    }
                } else {
                    scope.leftEye = currentBlink[1].toFixed(1);
                    scope.rightEye = currentBlink[0].toFixed(1);
                    if (!calibrationComplete) {
                        compareValues(currentBlink);
                    } else {
                        testBlinks(currentBlink)
                    }
                }
                frameId = window.requestAnimationFrame(readEyes);
            }

            let takeReadings = () => {
                frameId = window.requestAnimationFrame(readEyes);
                scope.display = "Keep Eyes Open";
            }



            let testBlinks = (vals) => {
                total = vals[0] + vals[1];
                if ((total / blinkZero) < blinkRatio) {
                    if (debounce && !scope.showMessage) {
                        scope.blinkReady = {
                            'color': 'red'
                        }
                        debounce = false;
                        blinkDelay()
                    }
                    else if(confirmDebounce) {
                    	confirmDebounce = false;
                        scope.confirmBox = {
                        	'border': '3px solid black'
                    	}
                    	confirmDelay();
                    }
                }
            }


            // Fill with gradient

            scope.calibrationFinished = function() {
                testDelay();
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
                console.log('ratio', blinkRatio, maxSum, minSum);
                calibrationComplete = true;

            }

            scope.end = () => {
                ConstantsFactory.setBlink(blinkRatio, blinkZero);
                cancelAnimationFrame(frameId);
                IterateFactory.zero('nav');
            }


            takeReadings();




        }
    }
});