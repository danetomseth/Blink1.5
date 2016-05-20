core.directive('blLetterType', function(TypeFactory, SpeechFactory) {
    return {
        restrict: 'E',
        templateUrl: 'templates/type-keyboard.html',
        link: function(scope) {
            scope.wordInput = '';
            scope.selected = [null, null];
            scope.speaking = false;

            //makes sure first element is highlighted on page load
            scope.keyboard = TypeFactory.alphabet;

            scope.$watch(function() {
                return TypeFactory.selectedLetter;
            }, function(newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    if(TypeFactory.selectedLetter) {
                        scope.selected = TypeFactory.selectedLetter;
                    }
                    else scope.selected = [null, null];
                }
            });

            scope.$watch(function() {
                return TypeFactory.word
            }, function(newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    scope.wordInput = TypeFactory.word;
                }
            });

            scope.scopeValue = TypeFactory.scopeValue;

            function togglePlay(){
                scope.speaking = !scope.speaking;
            }

            scope.say = () => SpeechFactory.say(scope.wordInput, "UK English Male", {onstart: togglePlay, onend: togglePlay});
        }

    }
});
