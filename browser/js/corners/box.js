core.directive('blBox', function(){

    return {
        restrict: "E",
        templateUrl: "templates/corners-box.html",
        scope: {
            contents: "="
        },
        link: function(scope, elem, attrs){
            var box = angular.element(elem[0].children[0]);
            var letterBox = angular.element(elem[0].children[0].children[0]);
            scope.$watch("contents", function(){
                if (scope.contents.length > 1){
                    box.addClass("letter-grid");
                    letterBox.removeClass("single-letter");
                    scope.letters = scope.contents
                    
                } else {
                    box.removeClass("letter-grid");
                    letterBox.addClass("single-letter");
                    scope.letters = scope.contents[0] //["-", "-", scope.contents, "-", "-"]

                }
            })
        }
    }

})
