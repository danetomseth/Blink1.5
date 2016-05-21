core.directive('blCorners', function($rootScope, CornersCalibrate, CornersFactory) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/corners-grid.html',
        link: function(scope, elem, attr) {

            scope.calibrated = true;
            scope.calStart = false;
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
            }, true);

            scope.$watch(function() {
                return CornersCalibrate.selectedBox;
            }, function(newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    scope.calibrateBox = CornersCalibrate.selectedBox;
                }
            }, true);

            scope.$watch(function() {
                return CornersCalibrate.calBoxes;
            }, function(newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    scope.calBoxes = CornersCalibrate.calBoxes;
                }
            }, true);

            scope.start = () => {
                scope.calStart = true;
                CornersCalibrate.runCalibration();
            }

            // $rootScope.$on("changeBox", function(thing, box){
            //     scope.selectedBox = box;
            //     scope.$digest();
            // });

        }
    };

});