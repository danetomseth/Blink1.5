core.directive('blLetterScroll', function($rootScope, KeyboardFactory, PositionFactory, TrackingFactory, WebcamFactory, TimerFactory, $mdToast) {
    return {
        restrict: 'E',
        templateUrl: 'templates/scroll-letter.html',
        scope: '=',
        link: function(scope, elem, attr) {

            let count = 0;
            let selectingLetter = false;

            //makes sure first element is highlighted on page load
            scope.currentRow = 0;
            scope.alphabet = KeyboardFactory.alphabet;
            scope.browDebounce = true;

            var video = document.getElementById('webcam');
            var canvas = document.getElementById("canvas");

            TrackingFactory.startTracking(canvas, video);
            WebcamFactory.startWebcam(video);

            function keyboardIterator() {
                if (scope.browDebounce && !selectingLetter) {
                    scope.currentRow = KeyboardFactory.iterateRow();
                } else if (scope.browDebounce && selectingLetter) {
                    scope.currentLetter = KeyboardFactory.iterateLetter();
                    console.log('current letter', scope.currentLetter);
                }
                scope.$digest();
            }
            function resetBrow() {
                scope.selected = scope.currentLetter;
                scope.currentLetter = '';
                if (selectingLetter) {
                    scope.wordInput = KeyboardFactory.selectLetter();
                    console.log("frontend scope", scope.wordInput)
                    selectingLetter = false;
                } else {
                    selectingLetter = true;
                }
                scope.$digest();
                setTimeout(function() {
                    scope.selected = '';
                    scope.$digest();
                    scope.browDebounce = true;
                }, 750)
            }

            function readPositions() {
                var positions = TrackingFactory.getPositions();
                if (positions) {
                    if (PositionFactory.browCompare(positions) && scope.browDebounce) {
                        scope.browDebounce = false;
                        resetBrow();
                    }
                }
                scope.$digest();
            }

            //calibrate function that checks converge of model
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
                TimerFactory.moveCursor(keyboardIterator, 750);
            }

            //this function waits until the video stream starts then runs draw loop and starts auto calibrate
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
