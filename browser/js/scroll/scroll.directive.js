core.directive('blLetterScroll', function($rootScope, KeyboardFactory, PositionFactory, TrackingFactory, WebcamFactory, TimerFactory, $mdToast) {
    return {
        restrict: 'E',
        templateUrl: 'templates/scroll-letter.html',
        scope: '=',
        link: function(scope, elem, attr) {

            function showToast(letter) {
                scope.$digest();
                $mdToast.show($mdToast.simple({
                    position: 'top right',
                    hideDelay: 1000
                }
                ).textContent(letter));
            }

            let count = 0;
            let selectingLetter = false;
            let resumeKeyboard = true;

            scope.current = 1;
            scope.alphabet = KeyboardFactory.alphabet;

            scope.browDebounce = true;


            var video = document.getElementById('webcam');
            var canvas = document.getElementById("canvas");

            TrackingFactory.startTracking(canvas, video);
            WebcamFactory.startWebcam(video);


            function keyboardIterator() {
                if (resumeKeyboard && !selectingLetter) {
                    scope.current = KeyboardFactory.iterateRow();
                } else if (resumeKeyboard && selectingLetter) {
                    scope.current = KeyboardFactory.iterateLetter();
                }
            }

            function pauseKeyboard() {
                resumeKeyboard = false;
                setTimeout(function() {
                    resumeKeyboard = true;
                    scope.selected = '';
                }, 750)
            }

            function resetBrow() {
                scope.selected = scope.current;
                scope.current = '';
                if (selectingLetter) {
                    showToast(KeyboardFactory.getCurrentLetter());
                    scope.wordInput = KeyboardFactory.selectLetter();
                    selectingLetter = false;
                } else {
                    selectingLetter = true;
                }
                scope.$digest();
                setTimeout(function() {
                    scope.$digest();
                    scope.browDebounce = true;
                }, 750)
            }


            function readPositions() {
                var positions = TrackingFactory.getPositions();
                if (positions) {
                    if (PositionFactory.browCompare(positions) && scope.browDebounce) {
                        pauseKeyboard();
                        scope.browDebounce = false;
                        resetBrow();
                    }
                }
                scope.$digest();
            }

             function setZero() {
                var converge = TrackingFactory.convergence();
                if (converge < 300) {
                    count++;
                    if (count > 20) {
                        clearInterval($rootScope.calibrateInterval);
                        scope.browZero();
                    }
                } else {
                    count = 0;
                }
            }

            scope.browZero = function() {
                var positions = TrackingFactory.getPositions();
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(readPositions, 50);
                clearInterval($rootScope.calibrateInt);
                TimerFactory.moveCursor(keyboardIterator,750);
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