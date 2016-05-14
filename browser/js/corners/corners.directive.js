core.directive('blCorners', function($rootScope, TrackingFactory, IterateFactory, CornersFactory, WebcamFactory, TimerFactory, PositionFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/corners-grid.html',
        link: function(scope, elem, attr) {
            // let zero = [];
            // scope.selectedBox = CornersFactory.getSelected();
            // scope.boxes = CornersFactory.getBoxes()
            // scope.phrase = CornersFactory.getPhrase();
            // scope.wordInput = scope.phrase[0]




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



           


        }
    };

});
