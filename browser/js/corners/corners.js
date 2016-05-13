core.directive('blCorners', function($rootScope, TrackingFactory, CornersFactory, WebcamFactory, TimerFactory, PositionFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/corners-grid.html',
        link: function(scope, elem, attr) {
            let zero = [];
            scope.selectedBox = 4;
            scope.boxes = CornersFactory.getBoxes()


            scope.zeroEyes = function() {
                zero = [scope.eyeX, scope.eyeY]
            }

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
                }
            }

            function zeroEyes() {
                let count = 6;
                let countInterval;
                countInterval = setInterval(function(){
                    count--;
                    scope.boxes[4].contents = count;
                    scope.$digest();
                }, 1000)
                setTimeout(function() {
                    scope.zeroEyes();
                    scope.selectedBox = null;
                    scope.boxes[4].contents = "";
                    clearInterval(countInterval)
                }, 5000);
            }

            TimerFactory.startReading(readPositions, 50);
            zeroEyes();


        }
    };

});
