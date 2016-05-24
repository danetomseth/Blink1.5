core.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
    });

});

core.controller('HomeCtrl', function($scope, $mdBottomSheet, ConstantsFactory) {

    $scope.boxInput = "";
    $scope.openBottomSheet = function() {
    $mdBottomSheet.show({
      templateUrl: 'templates/bottom-keyboard.html',
      disableBackdrop: true,
      controller: 'PopupCtrl',
      clickOutsideToClose: true,
      parent: angular.element(document.getElementById('content'))
    });
  };


  $scope.calibrated = ConstantsFactory.blinkCalibrated;
  console.log($scope.calibrated);



  $scope.showCalibration = () => {
    $scope.calibrated = false;
  }

});
