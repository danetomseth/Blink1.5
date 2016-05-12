core.directive('blLetterType', function(KeyboardFactory, SpeechFactory, TimerFactory, IterateFactory) {
    return {
        restrict: 'E',
        templateUrl: 'templates/type-keyboard.html',

        link: function(scope, elem, attr) {
            let count = 0;
            let selectingLetter = false;
            let delay = scope.delay; // reference from ScrollCtrl
            scope.wordInput = '';

            //makes sure first element is highlighted on page load
            scope.keyboard = KeyboardFactory.alphabet;
            scope.browDebounce = true;

            scope.$watch(function() {
                return IterateFactory.selectedLetter
            }, function(newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    scope.selected = IterateFactory.selectedLetter;
                }
            });

            scope.$watch(function() {
                return IterateFactory.word
            }, function(newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    scope.wordInput = IterateFactory.word;
                }
            });

            scope.scopeValue = IterateFactory.scopeValue;


            scope.say = () => SpeechFactory.say(scope.wordInput);

        }

    }
});
