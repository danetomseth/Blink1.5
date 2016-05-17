core.directive('blCorners', function($rootScope, TrackingFactory, IterateFactory, CornersFactory, WebcamFactory, TimerFactory, PositionFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/corners-grid.html',
        link: function(scope, elem, attr) {
            scope.selectedBox = IterateFactory.selectedBox; //controls highlighting
            scope.boxes = CornersFactory.getBoxes(); //controls contents

            scope.phrase = CornersFactory.getPhrase();
            scope.wordInput = scope.phrase[0];

            scope.xPattern = true;
            scope.$watch(function() {
                return PositionFactory.getPattern()
            }, function(newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    scope.xPattern = PositionFactory.getPattern();
                }
            },true);


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
