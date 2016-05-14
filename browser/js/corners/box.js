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
