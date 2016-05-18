core.directive("blCalibrate", function(PositionFactory, TrackingFactory, $interval, $rootScope) {
    return {
        restrict: "E",
        templateUrl: 'templates/calibrate.html',
        link: function(scope, elem, attr) {

            let blinkCalibrate;
            let calibrationComplete = false;
            let currentBlink;
            let blinkZero = 0;
            let blinkRatio = 0;
            let maxVals = [];
            let minVals = [];
            let maxSum = 0;
            let minSum = 0;
            let endCalibration = false;
            let debounce = true;
            let converge = 50000;
            let confirmDebounce = true;
            scope.confirmBlink = 0;
            scope.maxCount = 60;
            scope.minCount = 60;

            scope.showMessage = false;

            scope.leftEye = 0;
            scope.rightEye = 0;


            


            // let calBlink = () => {
            //     let i = 1;
            //     scope.display = "Keep Eyes Open";
            //     blinkCalibrate = $interval(function() {
            //         let positions = TrackingFactory.getPositions();
            //         scope.count = i;
            //         if (i < 10) {
            //             PositionFactory.getBlinkAverage(positions);
            //         }
            //         if (i === 10) {
            //             scope.openZero = PositionFactory.setBlinkZero();
            //             scope.display = "Close Eyes"
            //         }
            //         if (i < 22 && i > 12) {
            //             PositionFactory.getBlinkAverage(positions);
            //             scope.display = "Close Eyes";
            //         }
            //         if (i === 22) {
            //             scope.closedZero = PositionFactory.setBlinkZero();

            //         }
            //         if (i > 22) {
            //             scope.display = "finished"
            //             scope.calFactor = (scope.closedZero / scope.openZero);
            //             $interval.clear(blinkCalibrate)
            //             i = 0;
            //         }
            //         i++
            //     }, 500);
            // }
            var start = 0;

            function blinkDelay() {
                
                setTimeout(function() {
                    debounce = true;
                    scope.blinkReady = {
                        'color': 'black'
                    }
                }, 500)
            }

            // function blinkDelay() {
            //     if (scope.confirmBlink > 0) {
            //         scope.confirmBlink--;
            //         scope.confirmBox = {
            //             'border': '3px solid red'
            //         }
            //     }
            //     setTimeout(function() {
            //         debounce = true;
            //         scope.confirmBox = {
            //             'border': 'none'
            //         }
            //         scope.blinkReady = {
            //             'color': 'black'
            //         }
            //     }, 500)
            // }

            function confirmDelay() {
            	if (scope.confirmBlink > 0) {
                    scope.confirmBlink--;
                }
                setTimeout(function() {
                    confirmDebounce = true;
                    scope.confirmBox = {
                        'border': 'none'
                    }
                }, 500)
            }


            function testDelay() {
                console.log('test start');
                setTimeout(function() {
                    scope.confirmBlink = 5;
                    console.log('blink count', scope.confirmBlink);
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
            var count = 0;
            var init = 0;
            var total = 0;

            function compareValues(vals) {
                total = vals[0] + vals[1];
                count++;
                scope.blinkReady = {
                    'opacity': '0.5'
                }
                if (maxVals.length > 60 && minVals.length > 60) {
                    scope.calibrationFinished();
                    scope.blinkReady = {
                    'opacity': '1'
                	}
                }

                if (maxVals.length <= 60) {
                    scope.maxCount = (60 - maxVals.length);
                } else {
                    scope.maxReady = {
                        'opacity': '0.5'
                    }
                }

                if (minVals.length <= 60) {
                    scope.minCount = (60 - minVals.length);
                } else {
                    scope.minReady = {
                        'opacity': '0.5'
                    }
                }
                if (count > 40 && count < 50) {
                    maxVals.push(total + 1);
                    minVals.push(total - 2);
                }
                if (count > 50) {
                    if (total) {
                        avgMaxMin(total);
                    }

                }
            };



            function step(timestamp) {
                scope.$digest()
                if (!start) {
                    start = timestamp;
                }
                var progress = timestamp - start;
                var positions = TrackingFactory.getPositions()
                if (positions) {
                    currentBlink = PositionFactory.getBlinkValue(positions)
                }

                if (converge > 0.5) {
                    converge = TrackingFactory.convergence();
                } else {
                    scope.leftEye = currentBlink[1].toFixed(1);
                    scope.rightEye = currentBlink[0].toFixed(1);
                    if (!calibrationComplete) {
                        compareValues(currentBlink);
                    } else {
                        testBlinks(currentBlink)
                    }
                }
                if (!endCalibration) {
                    window.requestAnimationFrame(step);
                }
            }

            let calInt;
            let takeReadings = () => {
                window.requestAnimationFrame(step);
                scope.display = "Keep Eyes Open";
            }


            takeReadings();

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
                        	'border': '3px solid red'
                    	}
                    	confirmDelay();
                    }

                    console.log('Blinkkkkkkkkk');
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
                calibrationComplete = true;

                //testBlinks();

                console.log('Max', maxSum);
                console.log('Min', minSum);
                console.log("ratio", (minSum / maxSum));
                console.log('length max', maxVals.length);
                console.log('length min', minVals.length);

                //calBlink();

            }

            scope.end = () => {
                endCalibration = true;
            }

            scope.startCalibration = function() {
                takeReadings();
            }

            scope.takeZero = function() {
                //console.log(positions);
                scope.zero = PositionFactory.setBlinkZero();
            }

            scope.takeDiff = function() {
                let positions = TrackingFactory.getPositions();
                //console.log(positions);
                scope.change = PositionFactory.blinkCompare(positions);
            }

            //scope.setZero
        }
    }
});