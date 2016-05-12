core.controller('PopupCtrl', function($scope, PopupFactory, IterateFactory, $mdBottomSheet) {

    $scope.keyboard = PopupFactory.letterObj;
    $scope.rowCount = 0;
    $scope.wordInput = "hello";
    // $scope.scopeValue = [];
    // $scope.scopeValue[0] = 0;
    // $scope.scopeValue[1] = 'A';

    let count = 0;
    let selectingLetter = false;
    //let delay = scope.delay; // reference from ScrollCtrl

    //makes sure first element is highlighted on page load


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
    //IterateFactory.zero('popup');
    $scope.scopeValue = [0,'A'];


    //$scope.scopeValue = IterateFactory.scopeValue;


});