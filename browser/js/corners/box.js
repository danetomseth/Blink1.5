core.directive('blBox', function($rootScope, TrackingFactory, WebcamFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/corners-box.html',
        link: function(scope, elem, attr) {

   			var box = angular.element(document.getElementById('box'));
            console.log('box width', box[0].clientWidth);
            console.log('box width', box);
            // scope.boxHeight = box[0].clientWidth;
            scope.boxHeight = box[0].clientWidth + 'px';



        }
    }
});