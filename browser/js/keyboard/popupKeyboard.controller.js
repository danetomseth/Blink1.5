core.controller('PopupCtrl', function($scope, PopupFactory, IterateFactory) {

    $scope.keyboard = PopupFactory.alphabet;
    $scope.rowCount = 0;
    $scope.wordInput = "hello";


    $scope.$watch(function() {
        return IterateFactory.selectedLetter
    }, function(newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.selected = IterateFactory.selectedLetter;
        }
    });

    $scope.$watch(function() {
        return IterateFactory.word
    }, function(newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.wordInput = IterateFactory.word;
        }
    });

    $scope.scopeValue = IterateFactory.scopeValue;
    IterateFactory.zero('popup');


});
