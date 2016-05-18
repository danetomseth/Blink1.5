core.directive("blCalibrate", function(PositionFactory, SettingsFactory, IterateFactory, TrackingFactory, ConstantsFactory, $interval, $rootScope) {
    return {
        restrict: "E",
        templateUrl: 'templates/calibrate.html',
        link: function(scope, elem, attr) {


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
            let zeroFinished = false;
            let testFinished = false;
            let calibrationFinished = false;
            scope.calStart = false;

            let count = 0;
            let total = 0;

            scope.confirmBlink = "---";
            scope.maxCount = 0;
            scope.minCount = 0;

            scope.showMessage = false;

            scope.leftEye = 0;
            scope.rightEye = 0;






            function testDelay() {
                setTimeout(function() {
                    scope.showMessage = true;
                    testFinished = true;
                    scope.message = "Keep Settings?"
                }, 5000)
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
                    setValues();
                    scope.blinkReady = {
                        'opacity': '1'
                    }
                }

                // not that important

                if (maxVals.length <= 50) {
                    scope.maxCount = (maxVals.length / 50) * 100;
                } else {
                    scope.maxReady = {
                        'opacity': '0.5'
                    }
                }

                if (minVals.length <= 50) {
                    scope.minCount = (minVals.length / 50) * 100;
                } else {
                    scope.minReady = {
                        'opacity': '0.5'
                    }
                }
                /// to here

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




            function readEyes(timestamp) {
                scope.$digest()

                let positions = TrackingFactory.getPositions()
                if (positions) {
                    currentBlink = PositionFactory.getBlinkValue(positions)
                }

                if (converge > 0.5 && !zeroFinished) {
                    $rootScope.zeroActive = true;
                    converge = TrackingFactory.convergence();
                    if (converge <= 0.5) {
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
                if(!calibrationFinished) {
                    frameId = requestAnimationFrame(readEyes);
                }
            }



            let setValues = function() {
                //testDelay();
                scope.confirmBlink = 5;
                maxVals.forEach(function(val) {
                    maxSum += val;
                })
                maxSum = maxSum / maxVals.length;

                minVals.forEach(function(val) {
                    minSum += val;
                })
                minSum = minSum / minVals.length;

                blinkZero = maxSum;

                blinkRatio = (minSum / maxSum) - 0.05;
                calibrationComplete = true;

            }



            let testBlinks = (vals) => {
                total = vals[0] + vals[1];
                if ((total / blinkZero) < blinkRatio) {
                    if (debounce) {
                        if (scope.showMessage) {
                            scope.confirmBox = {
                                'border': '3px solid black'
                            }
                        } else {
                            scope.blinkReady = {
                                'color': 'red'
                            }
                        }
                        debounce = false;
                        blinkDelay()
                    }
                }
            }

             function blinkDelay() {
                if (scope.confirmBlink > 0) {
                    scope.confirmBlink--;
                }
                if (scope.confirmBlink === 0) {
                    scope.showMessage = true;
                    navDelay()
                    scope.confirmBlink = "--"
                    return;
                }
                setTimeout(function() {
                    debounce = true;
                    scope.blinkReady = {
                        'color': 'black'
                    }
                    scope.confirmBox = {
                        'border': 'none'
                    }
                }, 500)
            }

            function navDelay() {
                scope.countDown = 3;
                let countDownInt = $interval(function() {
                    if(scope.countDown === 0) {
                        $interval.cancel(countDownInt);
                        moveToNav();
                    }
                    else {
                        scope.countDown--
                    }
                }, 750);

            }



            function moveToNav() {
                calibrationFinished = true;
                SettingsFactory.setThreshold(blinkRatio, blinkZero)
                ConstantsFactory.setBlink(blinkRatio, blinkZero);
                IterateFactory.iterate('nav');
                return;
            }






            scope.end = () => {
                calibrationFinished = true;
                SettingsFactory.setThreshold(blinkRatio, blinkZero)
                ConstantsFactory.setBlink(blinkRatio, blinkZero);
            }


            let takeReadings = () => {
                frameId = requestAnimationFrame(readEyes);
                scope.display = "Keep Eyes Open";
            }

            scope.start = () => {
                scope.calStart = true;
                scope.$evalAsync();
                //scope.$digest();
                setTimeout(function(){
                    takeReadings();
                }, 500)
                
            }




        }
    }
});
