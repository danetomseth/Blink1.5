core.directive('blLetterScroll', function(ScrollFactory, KeyboardFactory, PositionFactory) {
    return {
        restrict: 'E',
        templateUrl: 'templates/scroll-letter.html',
        controller: 'ScrollCtrl',
        scope: '=',
        link: function(scope, elem, attr) {

            scope.current = "A";
            scope.alphabet = KeyboardFactory.alphabet;
            let browDebounce = true;

            // Webcam
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

            var video = document.getElementById('webcam');

            //start tracker
            scope.ctracker = new clm.tracker();
            scope.ctracker.init(pModel);
            scope.ctracker.start(video);
            var canvas = document.getElementById("canvas");
            var context = canvas.getContext("2d");

            //all interval based logic
            var intervalRead;
            function takeReading() {
                intervalRead = setInterval(readPositions, 50);
            }

            var cursorInterval;
            function moveCursor() {
                cursorInterval = setInterval(keyboardIterator, 750);
            }

            function keyboardIterator() {
                if(browDebounce) {
                    scope.current = KeyboardFactory.iterator();
                }
                scope.$digest();
            }

            function resetBrow() {
                KeyboardFactory.selectLetter();
                setTimeout(function() {
                    KeyboardFactory.resetPosition();
                    scope.$digest();
                    browDebounce = true;
                }, 750)
            }

            scope.browZero = function() {
                var positions = scope.ctracker.getCurrentPosition();
                PositionFactory.setBrowZero(positions);
                takeReading();
            }

            function readPositions() {
                //get position coords
                var positions = scope.ctracker.getCurrentPosition();
                if (positions) {
                    if(PositionFactory.browCompare(positions) && browDebounce) {
                        console.log('Trigger!');
                        browDebounce = false;
                        resetBrow();
                    }
                }
            }

            function drawLoop() {
                requestAnimationFrame(drawLoop);
                context.clearRect(0, 0, canvas.width, canvas.height);
                scope.ctracker.draw(canvas);
            }

            var errorCallback = function(e) {
                console.log('Error connecting to source!', e);
            };

            // Processing video stream from webcam
            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                    video: true
                }, function(stream) {
                    scope.videoStream = stream;
                    video.src = window.URL.createObjectURL(scope.videoStream);
                    moveCursor();
                    drawLoop();
                }, errorCallback);
            } else {
                console.log('cannot find cam');
                alert('Cannot connect');
            }

        }

    }
});
