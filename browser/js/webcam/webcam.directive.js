core.directive('blWebcam', function(SidebarFactory, PositionFactory, $rootScope, $cacheFactory) {
    return {
        restrict: 'E',
        controller: 'HomeCtrl',
        templateUrl: 'templates/webcam.html',
        link: function(scope) {
            let videoStream;
            let ctracker;
            let count = 0;
            scope.webcamActive;
            scope.browDebounce = true;
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;
            //var video;
            var video = document.getElementById('corner-webcam');
            //start tracker
            ctracker = new clm.tracker();
            ctracker.init(pModel);
            ctracker.start(video);
            var canvas = document.getElementById("corner-canvas");
            var context = canvas.getContext("2d");

            var intervalRead;

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
                var converge = ctracker.getConvergence();
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
                console.log(videoStream.getVideoTracks());
                videoStream.getVideoTracks()[0].stop();
                ctracker.stop();
                SidebarFactory.changeState();
            }

            scope.browZero = function() {
                console.log('zero');
                var positions = ctracker.getCurrentPosition();
                PositionFactory.setBrowZero(positions);
                moveCursor();
                takeReading();
            }

            function readPositions() {
                //get position coords
                var positions = ctracker.getCurrentPosition();
                if (positions) {
                    if (PositionFactory.browCompare(positions) && scope.browDebounce) {
                        console.log('Trigger!');
                        scope.browDebounce = false;
                        resetBrow();
                    }
                }
            }

            function drawLoop() {
                requestAnimationFrame(drawLoop);
                context.clearRect(0, 0, canvas.width, canvas.height);
                ctracker.draw(canvas);
            }

            var errorCallback = function(e) {
                console.log('Error connecting to source!', e);
            };

            // Processing video stream from webcam

            calibrate();
            // drawCanvas();
            if (videoStream) {
                if (!videoStream.active) {
                    videoStream.active = true;
                }
            }


            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                    video: true
                }, function(stream) {
                    videoStream = stream;
                    video.src = window.URL.createObjectURL(videoStream);
                    console.log(videoStream);
                    drawLoop();
                    scope.webcamActive = true;
                }, errorCallback);
            } else {
                console.log('cannot find cam');
                alert('Cannot connect');
            }
        }
    }
});