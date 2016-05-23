core.directive('blCorners', function($rootScope, CornersCalibrate, CornersFactory, ActionFactory) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/corners-grid.html',
        link: function(scope, elem, attr) {

            scope.calibrated = true;
            let boxWidth = angular.element(document.getElementById("heightItem"))[0].clientWidth;
            let setHeight = boxWidth * 0.65 + 'px';
            let rowHeight = (boxWidth * 0.65) / 3 + 'px';
            scope.rowHeight = {
                'height' : rowHeight
            }
            scope.setHeight = {
                'height' : setHeight
            }
            console.log('set height', setHeight);
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








            //Calibration functions

            //switches current calibrate location 
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

            scope.$watch(function() {
                return CornersCalibrate.calibrationFinished;
            }, function(newVal) {
                if (typeof newVal !== 'undefined') {
                    scope.calibrated = CornersCalibrate.calibrationFinished;
                    console.log('updated', scope.calibrated);
                }
            }, true);

            scope.start = () => {
                scope.calStart = true;
                CornersCalibrate.runCalibration();
            }


            $rootScope.$on("singleBlink", function(thing, box){
                if(!scope.calStart && ActionFactory.isActive('corners')) {
                    scope.start();
                    scope.$digest();
                }
            });

        }
    };

});