core.directive("blCalibrate", function(CalibrateFactory, $state, $rootScope) {
    return {
        restrict: "E",
        templateUrl: 'templates/calibrate.html',
        link: function(scope, elem, attr) {

            let calibrationComplete = false;
            let debounce = true;
            scope.calStart = false;
            scope.confirmBlink = 10;
            scope.showMessage = false;
            //scope.blinkCounts = [0,0];

            // 0: open eye
            // 1: middleBox
            // 2: closed eye
            // 3: countdown
            scope.blinkStatus = []
            
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


            let testBlink = () => {
                if (debounce) {
                    if (scope.showMessage) {
                        scope.blinkStatus[3] = {
                            'border': '3px solid black'
                        }
                    } else {
                        scope.blinkStatus[1] = {
                            'color': 'red'
                        }
                    }
                    debounce = false;
                    blinkDelay()
                }
            }

            function blinkDelay() {
                if (scope.confirmBlink > 0) {
                    scope.confirmBlink--;
                }
                if (scope.confirmBlink === 0) {
                    scope.showMessage = true;
                    moveToNav()
                    scope.confirmBlink = "--"
                    return;
                }
                setTimeout(function() {
                    debounce = true;
                    scope.blinkStatus[1] = {
                        'color': 'black'
                    }
                    scope.blinkStatus[3] = {
                        'border': 'none'
                    }
                }, 400)
            }


            function moveToNav() {
                //set action factory here
                CalibrateFactory.calibrationSet = false;
                setTimeout(() => {
                    $state.go('type');
                }, 500);                

            }



            $rootScope.$on('singleBlink', (event, data) => {
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