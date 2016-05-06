app.directive('blCorners', function() {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/corners-grid.html',
        link: function(scope) {

            let zero = [];

            scope.zeroEyes = function() {
                zero = [scope.eyeX, scope.eyeY]
                console.log(zero);
            }

            //initiates webcam
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

            var errorCallback = function(e) {
                console.log('Reeeejected!', e);
            };

            var video = document.getElementById('webcam-bg');



            //start tracker
            var ctracker = new clm.tracker();
            ctracker.init(pModel);
            ctracker.start(video);
            var canvas = document.getElementById("canvas-bg");
            var context = canvas.getContext("2d");

            scope.box = [0, 0, 0, 0, 0, 0, 0, 0, 0]

            function eyePosition() {
                var xDiff = zero[0] - scope.eyeX;
                var yDiff = zero[1] - scope.eyeY;
                var thresholdX = 4;
                scope.xDiff = xDiff.toFixed(1);
                scope.yDiff = yDiff.toFixed(1);

                if (xDiff < 0 && yDiff > 0) { // LEFT TOP
                    scope.box = [1, 0, 0, 0, 0, 0, 0, 0, 0]
                } else if (xDiff > 0 && yDiff > 0) { // RIGHT TOP
                    scope.box = [0, 0, 1, 0, 0, 0, 0, 0, 0]
                } else if (xDiff > 0 && yDiff < 0) { // BOTTOM RIGHT
                    scope.box = [0, 0, 0, 0, 0, 0, 0, 0, 1]
                } else if (xDiff < 0 && yDiff < 0) { // BOTTOM LEFT
                    scope.box = [0, 0, 0, 0, 0, 0, 1, 0, 0]
                }
            }

            // var trackInterval;

            // function trackEyes() {
            //     trackInterval = setInterval(positionLoop, 10);
            // }


            //initial canvas drawing
            function positionLoop() {
                requestAnimationFrame(positionLoop);
                var positions = ctracker.getCurrentPosition();
                if (positions) {
                    scope.eyeX = positions[27][0] + positions[32][0]
                    scope.eyeY = positions[27][1] + positions[32][1]
                    eyePosition();
                    scope.$digest();
                }
            }

            //draws on canvas, needed to position over video
            function drawLoop() {
                requestAnimationFrame(drawLoop);
                context.clearRect(0, 0, canvas.width, canvas.height);
                ctracker.draw(canvas);
            }

            //trackEyes();
            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                    video: true
                }, function(stream) {
                    video.src = window.URL.createObjectURL(stream);
                    console.log('video load');
                    drawLoop();
                    positionLoop();
                }, errorCallback);
            } else {
                console.log('cannot find cam');
                alert('Cannot connect')
            }


        }
    };

});