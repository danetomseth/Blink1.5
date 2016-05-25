core.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
    });

});

core.controller('HomeCtrl', function($scope, $rootScope, $mdBottomSheet, ConstantsFactory, ActionFactory) {

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


    let goToNav = false;
    $rootScope.$on('singleBlink', () => {
        if ($scope.calibrated && !goToNav) {
            goToNav = true;
            setTimeout(() => {
                ActionFactory.runEvents('nav');
            }, 500);
        }
    });



    $scope.showCalibration = () => {
        $scope.calibrated = false;
    }

});