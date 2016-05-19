core.controller('PopupCtrl', function($scope, PopupFactory, IterateFactory) {

    $scope.keyboard = PopupFactory.alphabet;
    $scope.rowCount = 0;
    $scope.wordInput = "hello";
    // $scope.scopeValue = [];
    // $scope.scopeValue[0] = 0;
    // $scope.scopeValue[1] = 'A';

    //let delay = scope.delay; // reference from ScrollCtrl


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
    console.log('in pop ctrl');
    //$scope.scopeValue = [0,'A'];


    $scope.scopeValue = IterateFactory.scopeValue;
    IterateFactory.zero('popup');


});
