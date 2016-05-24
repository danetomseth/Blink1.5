core.directive("blCalibrate", function(CalibrateFactory, $state, $rootScope, ActionFactory, $interval) {
    return {
        restrict: "E",
        templateUrl: 'templates/calibrate.html',
        link: function(scope, elem, attr) {
            let calibrationComplete = false;
            let debounce = true;
            scope.calStart = false;
            scope.confirmBlink = 5;
            scope.showMessage = false;
            //scope.blinkCounts = [0,0];

            // 0: open eye
            // 1: middleBox
            // 2: closed eye
            // 3: countdown
            scope.blinkStatus = CalibrateFactory.blinkStatus;
            
            //used for css changes on scope
            scope.$watch(function() {
                return CalibrateFactory.blinkStatus
            }, function(newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    scope.blinkStatus = CalibrateFactory.blinkStatus;
                }
            });

            //used for % calibration
            scope.$watch(function() {
                return CalibrateFactory.blinkCounts
            }, function(newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    scope.blinkCounts = CalibrateFactory.blinkCounts;
                }
            });

            function blinkDelay() {
                if (scope.confirmBlink > 0) {
                    scope.confirmBlink--;
                }
                if (scope.confirmBlink === 0) {
                    scope.showMessage = true;
                    countDelay()
                    scope.confirmBlink = "--"
                    return;
                }
                setTimeout(function() {
                    scope.blinkStatus[1] = {
                        'color': 'black'
                    }
                    scope.blinkStatus[3] = {
                        'border': 'none'
                    }
                }, 400);
            }


            let testBlink = () => {
                console.log('confirm', scope.confirmBlink);
                    if (scope.showMessage) {
                        scope.blinkStatus[3] = {
                            'border': '3px solid black'
                        }
                    } else {
                        scope.blinkStatus[1] = {
                            'color': 'red'
                        }
                    }
                    blinkDelay()
                
            }

            let countInt;
            function countDelay () {
                scope.countDown = 5;
                countInt = $interval(() => {
                    scope.countDown--
                    if(scope.countDown === 0) {
                        moveToNav();
                        $interval.cancel(countInt)
                    }
                }, 1000)
            }

            


            function moveToNav() {
                //set action factory here
                CalibrateFactory.calibrationSet = false;
                setTimeout(() => {
                    ActionFactory.runEvents('nav');
                }, 500);                

            }


            let blinkStart = true;
            $rootScope.$on('singleBlink', () => {
                if(blinkStart) {
                    blinkStart = false;
                    scope.start();
                }
                if (CalibrateFactory.calibrationSet) {
                    testBlink();
                }
            });

            scope.start = () => {
                CalibrateFactory.runCalibration();
                scope.calStart = true;
            }
        }

    }
});