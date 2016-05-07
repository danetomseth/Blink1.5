core.directive('blCorners', function($rootScope, TrackingFactory, WebcamFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/corners-grid.html',
        link: function(scope, elem, attr) {

            let zero = [];


            scope.TLBox = ["A", "B", "C", "D", "E", ""];
            scope.TMBox = 'blankTM';
            scope.MLBox = 'blankML';
            scope.MRBox = 'blankMR';
            scope.BMBox = 'blankBM';
            scope.MMBox = 'middle';
            scope.TRBox = ["F", "G", "H", "I", "J", ""];
            //scope.MMBox = ["K", "L", "M", "N", "O", ""];
            scope.BLBox = ["P", "Q", "R", "S", "T", ""];
            scope.BRBox = ["U", "V", "W", "X", "Y", "Z"];

            let defaultBoxes = [scope.TLBox, scope.TMBox, scope.TRBox, scope.MLBox, scope.MMBox, scope.MRBox, scope.BLBox, scope.BMBox, scope.BRBox];
            scope.boxes = defaultBoxes

            scope.zeroEyes = function() {
                zero = [scope.eyeX, scope.eyeY]
            }

            // var box = angular.element(document.getElementById('box'));
            // console.log('box width', box[0].clientWidth);
            scope.boxHeight = '50px';


            // var video = document.getElementById('webcam-bg');
            // var canvas = document.getElementById("canvas-bg");
            // TrackingFactory.startTracking(canvas, video);
            // WebcamFactory.startWebcam(video);
            // videoStatus();

            scope.box = [0, 0, 0, 0, 0, 0, 0, 0, 0]

            function eyePosition() {
                var xDiff = zero[0] - scope.eyeX;
                var yDiff = zero[1] - scope.eyeY;
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


            $rootScope.intervalRead;

            function takeReading() {
                $rootScope.intervalRead = setInterval(readPositions, 50);
            }


            function readPositions() {
                var positions = TrackingFactory.getPositions();
                if (positions) {
                    scope.eyeX = positions[27][0] + positions[32][0]
                    scope.eyeY = positions[27][1] + positions[32][1]
                    eyePosition();
                    scope.$digest();
                }
            }

            var videoInterval
            function videoStatus() {
                videoInterval = setInterval(function() {
                    if($rootScope.videoActive) {
                        clearInterval(videoInterval);
                        TrackingFactory.drawLoop();
                        takeReading();
                    }
                }, 100)
            }

        }
    };

});