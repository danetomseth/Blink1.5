core.directive('blLetterType', function(KeyboardFactory, SpeechFactory, TimerFactory) {
    return {
        restrict: 'E',
        templateUrl: 'templates/type-keyboard.html',
        link: function(scope, elem, attr) {
            let delay = scope.delay; // reference from ScrollCtrl
            
            scope.wordInput = '';
            scope.selected = [null, null];
            scope.speaking = false;

            //makes sure first element is highlighted on page load
            scope.keyboard = KeyboardFactory.alphabet;
            scope.browDebounce = true;

            scope.$watch(function() {
                return KeyboardFactory.selectedLetter
            }, function(newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    if(KeyboardFactory.selectedLetter) {
                        scope.selected = KeyboardFactory.selectedLetter;
                    }
                    else scope.selected = [null, null];
                }
            });

            scope.$watch(function() {
                return KeyboardFactory.word
            }, function(newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    scope.wordInput = KeyboardFactory.word;
                }
            });

            scope.scopeValue = KeyboardFactory.scopeValue;

            scope.say = () => SpeechFactory.say(scope.wordInput, "UK English Male", {onstart: togglePlay, onend: togglePlay});

            function togglePlay(){
                scope.speaking = !scope.speaking;
                console.log("playing", scope.speaking)
            }

        }

    }
});
