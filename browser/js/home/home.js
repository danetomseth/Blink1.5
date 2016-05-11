core.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl',
        onEnter: function(IterateFactory) {
        	//this starts nav iteration on home page
        	console.log('Entering home!');
        	//IterateFactory.zero('nav');
        }
    });

});

core.controller('HomeCtrl', function($scope, $mdBottomSheet) {

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


});