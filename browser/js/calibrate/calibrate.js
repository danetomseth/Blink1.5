core.directive("blCalibrate", function(PositionFactory, TrackingFactory, $interval) {
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
            var maxSum = 0;
            var minSum = 0;
            let debounce = true;

            scope.leftEye = 111;
            scope.rightEye = 111;


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
            var start;

            function blinkDelay() {
            	setTimeout(function() {
            		debounce = true;
            		scope.blinkReady = {
                        'color': 'black'
                    }
            	}, 500)
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
                    console.log("max pushed", sum);
                    maxVals.push(sum);
                } else if (sum < minSum) {
                    console.log('min pushed', sum);
                    minVals.push(sum);
                }
            }
            var count = 0;
            var init = 0;

            function compareValues(vals) {
                var total = vals[0] + vals[1];
                count++;
                if (count % 20 === 0) {
                    console.log('val:', total);
                }
                if (count === 100) {
                    maxVals.push(total - 3);
                    minVals.push(total + 3);
                    console.log(maxVals, minVals);
                }
                if (count > 100) {
                    if (total) {
                        avgMaxMin(total);
                    }

                }
            };



            function step(timestamp) {
                if (!start) start = timestamp;
                var progress = timestamp - start;
                currentBlink = PositionFactory.getBlinkValue(TrackingFactory.getPositions())
                scope.leftEye = currentBlink[1].toFixed(1);
                scope.rightEye = currentBlink[0].toFixed(1);
                if (!calibrationComplete) {
                    compareValues(currentBlink);
                } else {
                    testBlinks(currentBlink)
                }
                window.requestAnimationFrame(step);
                scope.$digest()
            }

            let calInt;
            let takeReadings = () => {
                window.requestAnimationFrame(step);
                scope.display = "Keep Eyes Open";
                // calInt = $interval(function() {
                // 	console.log('reading');
                //     scope.leftEye = currentBlink[1].toFixed(1);
                //     scope.rightEye = currentBlink[0].toFixed(1);
                // }, 500);
            }

            let testBlinks = (vals) => {
                var total = vals[0] + vals[1];

                if ((total / blinkZero) < blinkRatio) {
                    if(debounce) {
                    	scope.blinkReady = {
                        'color': 'red'
                    }
                    	debounce = false;
                    	blinkDelay()
                    }
                    
                    console.log('Blinkkkkkkkkk');
                }
                // scope.blinkReady = {
                //     'color': 'green'
                // }
            }


            // Fill with gradient

            scope.takeReading = function() {

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

                //calBlink();

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