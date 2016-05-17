core.directive('blCorners', function($interval, $rootScope, TrackingFactory, CornersFactory, WebcamFactory, TimerFactory, PositionFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/corners-grid.html',
        link: function(scope, elem, attr) {
            // let zero = [];

            // // threshold variables
            // let threshold = 1;

            // // smoothing variables
            // let xAvg = [0,0,0,0]
            // let yAvg = [0,0,0,0]

            // gravity method variables
            // let tracking = false
            // let points = [];

            // tracking outside of eyes variables
            // let baseDistanceX = 0;
            // let baseDistanceY = 0;



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

            //scope.boxes[box] = "";

            // function config(fn, box) {
            //     let count = 6;
            //     let countInterval;
            //     countInterval = setInterval(function(){
            //         // CornersFactory.selectBox(null);
            //         count--;
            //         scope.boxes[box] = count;
            //         scope.$evalAsync();
            //     }, 1000)
            //     setTimeout(function() {
            //         fn();
            //         scope.boxes[box] = "";
            //         clearInterval(countInterval);
            //         //CornersFactory.goToBox();
            //         // let nextFn = configFn[configCount++]
            //         // if (nextFn) {config(nextFn[0], nextFn[1])};
            //     }, 5000);
            // }


            // scope.selectBox = function(box) {
            //     scope.selectedBox = box;
            //     CornersFactory.goToBox(box);
            //     console.log("going to box", box);
            // }

            scope.selectedBox = IterateFactory.selectedBox; //controls highlighting
            scope.boxes = CornersFactory.getBoxes() //controls contents
            scope.phrase = CornersFactory.getPhrase();
            scope.wordInput = scope.phrase[0]


            scope.$watch(function() {
                return IterateFactory.selectedBox
            }, function(newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                        scope.selectedBox = IterateFactory.selectedBox;
                }
            },true);

            function config(fn, box) {
                let count = 6;
                let countInterval;
                countInterval = $interval(function(){
                    // CornersFactory.selectBox(null);
                    count--;
                    scope.boxes[box] = count;
                    scope.$evalAsync();
                }, 1000);

                setTimeout(function() {
                    fn();
                    scope.boxes[box] = "";
                    $interval.cancel(countInterval);
                    countInterval = undefined;
                    CornersFactory.goToBox();
                    // let nextFn = configFn[configCount++]
                    // if (nextFn) {config(nextFn[0], nextFn[1])};
                }, 5000);
            }

            // TimerFactory.startReading(readPositions, 50);
            config(zeroEyes, 4);

            // Listen on DOM destroy (removal) event, to make sure interval is canceled after the DOM element was removed
            elem.on('$destroy', function() {
                if (angular.isDefined(countInterval)) {
                    $interval.cancel(countInterval);
                }
          });

        }
    };

});
