core.directive('blCorners', function($interval, $rootScope, TrackingFactory, CornersFactory, WebcamFactory, IterateFactory, TimerFactory, PositionFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/corners-grid.html',
        link: function(scope, elem, attr) {
           

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

         
            // Listen on DOM destroy (removal) event, to make sure interval is canceled after the DOM element was removed
            elem.on('$destroy', function() {
                if (angular.isDefined(countInterval)) {
                    $interval.cancel(countInterval);
                    countInterval = null;
                }
          });

        }
    };

});
