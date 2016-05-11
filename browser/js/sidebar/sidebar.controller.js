core.controller('SidebarCtrl', function($scope, $state, $rootScope, $mdSidenav, SidebarFactory, TimerFactory, AuthService, AUTH_EVENTS) {

    // Hide Login button if user is already signed in
    $scope.signedIn = !!(AuthService.isAuthenticated());

    //$scope.sidebarOpen = true;
    $scope.openSidebar = () => {
        $mdSidenav('left').open()
        $scope.sidebarOpen = true;
    }

    $scope.closeSidebar = () => {
        $mdSidenav('left').close()
        $scope.sidebarOpen = false;
    }

    $scope.stopWebcam = () => {
        TimerFactory.clearAll();
    }

    $scope.stopTacking = () => {
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

    $rootScope.$on(AUTH_EVENTS.loginSuccess, SidebarFactory.checkLogin);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, SidebarFactory.checkLogin);
    $rootScope.$on(AUTH_EVENTS.sessionTimeout, SidebarFactory.checkLogin);

});
