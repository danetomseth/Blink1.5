core.directive('blBox', function($rootScope, TrackingFactory, WebcamFactory) {

    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'templates/corners-box.html',
        link: function(scope, elem, attr) {
   			var box = angular.element(document.getElementById('box'));
            scope.boxHeight = box[0].clientWidth * 0.6 + 'px';
            scope.boxItem = elem;
            console.log('element', scope.box);
            //scope.contents = "hello";
            //elem.text('Hello');
        }
    }
});