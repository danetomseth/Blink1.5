core.controller("KeyboardCtrl", function($scope, KeyboardFactory) {
   $scope.alphabet = KeyboardFactory.alphabet;
      // Start looping through letters
   KeyboardFactory.loop(500);

    $scope.current = KeyboardFactory.getCurrentLetter();
    $scope.word = KeyboardFactory.getCurrentWord();
    console.log("current", $scope.current)

});
