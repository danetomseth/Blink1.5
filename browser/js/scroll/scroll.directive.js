core.directive('blLetterScroll', function($rootScope, KeyboardFactory, PositionFactory, TrackingFactory, WebcamFactory) {
    return {
        restrict: 'E',
        templateUrl: 'templates/scroll-letter.html',
        scope: '=',
        link: function(scope, elem, attr) {
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
            videoStatus();
            

            //all interval based logic
            $rootScope.intervalRead;

            function takeReading() {
                $rootScope.intervalRead = setInterval(readPositions, 50);
            }

            $rootScope.cursorInterval;

            function moveCursor() {
                $rootScope.cursorInterval = setInterval(keyboardIterator, 700);
            }

            function keyboardIterator() {
                if (resumeKeyboard && !selectingLetter) {
                    scope.current = KeyboardFactory.iterateRow();
                }
                else if (resumeKeyboard && selectingLetter) {
                    scope.current = KeyboardFactory.iterateLetter();
                }
            }

            $rootScope.calibrateInterval;
            function calibrate() {
                $rootScope.calibrateInterval = setInterval(setZero, 50)
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
                if(selectingLetter) {
                    scope.wordInput = KeyboardFactory.selectLetter();
                    selectingLetter = false;
                }
                else {
                    selectingLetter = true;
                }
                scope.$digest();
                setTimeout(function() {
                    scope.$digest();
                    scope.browDebounce = true;
                }, 750)
            }

            scope.browZero = function() {
                var positions = TrackingFactory.getPositions();
                PositionFactory.setBrowZero(positions);
                clearInterval($rootScope.calibrateInterval);
                moveCursor();
                takeReading();
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
