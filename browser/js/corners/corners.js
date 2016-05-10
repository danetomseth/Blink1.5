core.directive('blCorners', function($rootScope, TrackingFactory, WebcamFactory, TimerFactory, PositionFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/corners-grid.html',
        link: function(scope, elem, attr) {

            let zero = [];
            scope.selectedBox = 4;


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

            scope.boxHeight = '50px';


            scope.box = [0, 0, 0, 0, 0, 0, 0, 0, 0]

            function eyePosition() {
                var xDiff = zero[0] - scope.eyeX;
                var yDiff = zero[1] - scope.eyeY;
                scope.xDiff = xDiff.toFixed(1);
                scope.yDiff = yDiff.toFixed(1);

                if (xDiff < 0 && yDiff > 0) { // LEFT TOP
                    console.log('left top');
                    scope.selectedBox = 0;
                    scope.box = [1, 0, 0, 0, 0, 0, 0, 0, 0]
                } else if (xDiff > 0 && yDiff > 0) { // RIGHT TOP
                    scope.selectedBox = 2;
                    scope.box = [0, 0, 1, 0, 0, 0, 0, 0, 0]
                } else if (xDiff > 0 && yDiff < 0) { // BOTTOM RIGHT
                    scope.selectedBox = 8;
                    scope.box = [0, 0, 0, 0, 0, 0, 0, 0, 1]
                } else if (xDiff < 0 && yDiff < 0) { // BOTTOM LEFT
                    scope.selectedBox = 6;
                    scope.box = [0, 0, 0, 0, 0, 0, 1, 0, 0]
                }
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

             let videoStatus = () => {
                if ($rootScope.videoActive) {
                    TimerFactory.videoReady();
                    TrackingFactory.drawLoop();
                    scope.zeroEyes();
                    TimerFactory.startReading(readPositions, 50);
                    //TimerFactory.calibrate(setZero, 50);
                }
            }
            TimerFactory.videoStatus(videoStatus, 100);

        }
    };

});