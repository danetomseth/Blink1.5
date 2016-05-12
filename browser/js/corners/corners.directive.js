core.directive('blCorners', function($rootScope, TrackingFactory, CornersFactory, WebcamFactory, TimerFactory, PositionFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/corners-grid.html',
        link: function(scope, elem, attr) {
            let zero = [];
            scope.selectedBox = 4;
            scope.boxes = CornersFactory.getBoxes()


            // threshold variables
            let threshold = 1;

            // smoothing variables
            let xAvg = [0,0,0,0]
            let yAvg = [0,0,0,0]

            // gravity method variables
            // let tracking = false
            // let points = [];

            // tracking outside of eyes variables
            // let baseDistanceX = 0;
            // let baseDistanceY = 0;

            let zeroEyes = function() {
                zero = [scope.eyeX, scope.eyeY]
                //baseDistanceX = scope.eyeSocketX - scope.eyeX;
                //baseDistanceY = scope.eyeSocketY - scope.eyeY;
                //points.push({x: scope.eyeX, y: scope.eyeY, box: 4})
                console.log("zero eyes ran")

            }

            //gravity method functions
            // let TLEyes = function() {
            //     points.push({x: scope.eyeX, y: scope.eyeY, box: 0})
            //     console.log("TL eyes ran")
            // }
            // let TREyes = function() {
            //     points.push({x: scope.eyeX, y: scope.eyeY, box: 2})
            //     console.log("TR eyes ran")
            // }
            // let BLEyes = function() {
            //     points.push({x: scope.eyeX, y: scope.eyeY, box: 6})
            //     console.log("BL eyes ran")
            // }
            // let BREyes = function() {
            //     points.push({x: scope.eyeX, y: scope.eyeY, box: 8})
            //     console.log("BR eyes ran")
            //     startTracking()
            // }
            // let startTracking = function(){
            //     console.log("Points", points)
            //     tracking = true;
            //     console.log("startTracking", tracking)
            // };

            // take reference from side of eyes 25, 25 (left eye) 30, 28(right eye)
            // squint for middle



            function eyePosition() {

                //defaults
                // var xDiff = zero[0] - scope.eyeX;
                // var yDiff = zero[1] - scope.eyeY;
                // scope.xDiff = (xDiff).toFixed(1);
                // scope.yDiff = (yDiff).toFixed(1);

                // // tracking outside of eye
                // var xDiff = (scope.eyeSocketX - scope.eyeX) - baseDistanceX;
                // var yDiff = (scope.eyeSocketY - scope.eyeY) - baseDistanceY;
                // scope.xDiff = (xDiff).toFixed(1);
                // scope.yDiff = (yDiff).toFixed(1);
                // console.log("x/y diff", scope.xDiff, scope.yDiff)


                // //smoothing method, can be used in most other methods as well. computationally intense
                xAvg.shift()
                xAvg.push(scope.eyeX)
                let xAvgNum = 0
                for(var i in xAvg) {
                    xAvgNum += xAvg[i]
                }
                xAvgNum = xAvgNum/xAvg.length;
                yAvg.shift()
                yAvg.push(scope.eyeY)
                let yAvgNum = 0
                for(var i in yAvg) {
                    yAvgNum += yAvg[i]
                }
                yAvgNum = yAvgNum/yAvg.length;
                var xDiff = zero[0] - xAvgNum;
                var yDiff = zero[1] - yAvgNum;
                scope.xDiff = (xDiff).toFixed(1);
                scope.yDiff = (yDiff).toFixed(1);

                // //"gravity" method
                // if(tracking){
                //     console.log("checking points")
                //     function d(point) {
                //       return Math.pow(scope.eyeX-point.x, 2) + Math.pow(scope.eyeY-point.y, 2);
                //     }

                //     var closest = points.slice(1).reduce(function(min, p) {
                //       if (d(p) < min.d) min.point = p;
                //       return min;
                //     }, {point: points[0], d:d(points[0])}).point;

                //     console.log(closest)
                //     scope.selectedBox = closest.box;

                // }

                // //scroll corners method
                // if (xDiff < 0){
                //     scope.selectedBox--
                // } else if (xDiff > 0) {
                //     scope.selectedBox++
                // }

                // // difference from center method - most stable. Threshold ~1.5
                if (xDiff < -threshold && yDiff > threshold) { // LEFT TOP
                    scope.selectedBox = 0;
                    scope.box = [1, 0, 0, 0, 0, 0, 0, 0, 0]
                } else if (xDiff > threshold && yDiff > threshold) { // RIGHT TOP
                    scope.selectedBox = 2;
                    scope.box = [0, 0, 1, 0, 0, 0, 0, 0, 0]
                } else if (xDiff > threshold && yDiff < -threshold) { // BOTTOM RIGHT
                    scope.selectedBox = 8;
                    scope.box = [0, 0, 0, 0, 0, 0, 0, 0, 1]
                } else if (xDiff < -threshold && yDiff < -threshold) { // BOTTOM LEFT
                    scope.selectedBox = 6;
                    scope.box = [0, 0, 0, 0, 0, 0, 1, 0, 0]
                }
            }


            function readPositions() {
                var positions = TrackingFactory.getPositions();
                if (positions) {
                    scope.selectedBox = 4; // default to the center box on every run
                    scope.eyeX = positions[27][0] //+ positions[32][0]
                    scope.eyeY = positions[27][1] //+ positions[32][1]
                    //scope.eyeSocketX = positions[23][0] //+ positions[30][0]
                    //scope.eyeSocketY = positions[23][1] //+ positions[30][1]
                    // scope.rightOfEyes = positions[27][1] + positions[32][1]
                    eyePosition(); // if the eyes go more than the "threshold" away from center then go to the corner
                    scope.$evalAsync();
                }
            }

            let configCount = 0

            // let configFn = [
            //     [TLEyes, 0],
            //     [TREyes, 2],
            //     [BLEyes, 6],
            //     [BREyes, 8]
            // ];

            function config(fn, box) {
                let count = 6;
                let countInterval;
                countInterval = setInterval(function(){
                    // scope.selectedBox = null;
                    count--;
                    scope.boxes[box].contents = count;
                    scope.$evalAsync();
                }, 1000)
                setTimeout(function() {
                    fn();
                    scope.boxes[box].contents = "";
                    clearInterval(countInterval);
                    // let nextFn = configFn[configCount++]
                    // if (nextFn) {config(nextFn[0], nextFn[1])};
                }, 5000);
            }

            TimerFactory.startReading(readPositions, 50);
            config(zeroEyes, 4)


        }
    };

});
