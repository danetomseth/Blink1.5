// core.directive('blBox', function($rootScope, TrackingFactory, WebcamFactory) {

//     return {
//         restrict: 'E',
//         scope: {
//             contents: "="
//         },
//         templateUrl: 'templates/corners-box.html',
//         link: function(scope, elem, attr) {
//    			// var box = angular.element(document.getElementById('box'));
//             // scope.boxHeight = box[0].clientWidth * 0.6 + 'px';
//             // scope.boxItem = elem;
//             // console.log(scope.contents)
//             // console.log('element', scope.box);
//             //scope.contents = "hello";
//             //elem.text('Hello');
//         }
//     }
// });


core.directive('blBox', function(){

    return {
        restrict: "E",
        templateUrl: "templates/corners-box.html",
        scope: {
            contents: "="
        },
        link: function(scope, elem, attrs){
            scope.$watch("contents", function(){
                if (scope.contents.length === 1){
                    scope.elem = scope.contents[0] //["-", "-", scope.contents, "-", "-"]
                } else {
                    scope.elem = scope.contents

                }
            })
        }
    }

})
