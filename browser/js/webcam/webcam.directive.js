core.directive('blWebcam', function(SidebarFactory, PositionFactory, $rootScope, WebcamFactory, TrackingFactory) {
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
            videoStatus();

            var intervalRead;
            function takeReading() {
                intervalRead = setInterval(readPositions, 50);
            }

            

            function takeReading() {
                intervalRead = setInterval(readPositions, 50);
            }

            var cursorInterval;

            function moveCursor() {
                cursorInterval = setInterval(keyboardIterator, 1000);
            }

            function keyboardIterator() {
                $rootScope.selectedLink = SidebarFactory.moveSelected();
                scope.$digest();
            }

            let calibrateInterval;
            function calibrate() {
                calibrateInterval = setInterval(setZero, 50)
            }

            function setZero() {
                var converge = TrackingFactory.convergence();
                if (converge < 300) {
                    count++;
                    if (count > 20) {
                        clearInterval(calibrateInterval);
                        scope.browZero();
                    }
                } else {
                    count = 0;
                }
            }

            function resetBrow() {
                clearInterval(cursorInterval);
                clearInterval(intervalRead);
                SidebarFactory.changeState();
            }

            scope.browZero = function() {
                var positions = TrackingFactory.getPositions();
                PositionFactory.setBrowZero(positions);
                moveCursor();
                takeReading();
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

            var videoInterval
            function videoStatus() {
                videoInterval = setInterval(function() {
                    if($rootScope.videoActive) {
                        clearInterval(videoInterval);
                        TrackingFactory.drawLoop();
                        calibrate();
                    }
                }, 100)
            }

        }
    }
});