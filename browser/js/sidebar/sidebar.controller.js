core.controller('SidebarCtrl', function($scope, $state, $rootScope, $mdSidenav, SidebarFactory, TimerFactory, AuthService, AUTH_EVENTS) {

    $scope.stopWebcam = () => {
        TimerFactory.clearAll();
    }

    $scope.stopTracking = () => {
        TimerFactory.clearTracking();
        $scope.trackingStopped = true;
    }

    $scope.logOut = function() {
        return AuthService.logout()
            .then(function() {
                console.log("logged out")
                $state.go('home');
            });
    }

});
