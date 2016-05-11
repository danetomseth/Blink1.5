core.directive('blWebcam', function(SidebarFactory, PositionFactory, $rootScope, WebcamFactory, TrackingFactory, TimerFactory) {
    return {
        restrict: 'E',
        controller: 'HomeCtrl',
        templateUrl: 'templates/webcam.html',
        link: function(scope) {
            let count = 0;
            scope.browDebounce = true;

            //var video;
            var video = document.getElementById('corner-webcam');
            var canvas = document.getElementById("corner-canvas");

            TrackingFactory.startTracking(canvas, video);
            WebcamFactory.startWebcam(video);


            function keyboardIterator() {
                $rootScope.selectedLink = SidebarFactory.moveSelected();
                scope.$digest();
            }


            function setZero() {
                var converge = TrackingFactory.convergence();
                if (converge < 300) {
                    count++;
                    if (count > 20) {
                        clearInterval($rootScope.calibrateInt);
                        scope.browZero();
                    }
                } else {
                    count = 0;
                }
            }

            function resetBrow() {
                clearInterval($rootScope.cursorInt);
                clearInterval($rootScope.readPositionInt);
                SidebarFactory.changeState();
            }

            function readPositions() {
                var positions = TrackingFactory.getPositions();
                if (positions) {
                    if (PositionFactory.browCompare(positions) && scope.browDebounce) {
                        scope.browDebounce = false;
                        resetBrow();
                    }
                }
            }

            scope.browZero = function() {
                var positions = TrackingFactory.getPositions();
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(readPositions, 50);
                TimerFactory.moveCursor(keyboardIterator, 1000);
            }

            let videoStatus = () => {
                if ($rootScope.videoActive) {
                    clearInterval($rootScope.videoInterval);
                    TrackingFactory.drawLoop();
                    TimerFactory.calibrate(setZero, 50);
                }
            }

            TimerFactory.videoStatus(videoStatus, 100);


        }
    }
});
