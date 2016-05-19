core.directive('blCorners', function(CornersFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/corners-grid.html',
        link: function(scope, elem) {
            scope.selectedBox = CornersFactory.selectedBox; //controls highlighting
            scope.boxes = CornersFactory.getBoxes() //controls contents
            scope.phrase = CornersFactory.getPhrase();
            scope.wordInput = scope.phrase[0];

            scope.$watch(function() {
                return CornersFactory.selectedBox;
            }, function(newVal) {
                if (typeof newVal !== 'undefined') {
                    scope.selectedBox = CornersFactory.selectedBox;
                }
            },true);
        }
    };

});
