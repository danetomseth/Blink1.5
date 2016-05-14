core.controller('SidebarCtrl', function($scope, $state, $rootScope, $mdSidenav, SidebarFactory, TimerFactory, AuthService, AUTH_EVENTS) {

   
    $scope.logOut = function() {
        return AuthService.logout()
            .then(function() {
                $state.go('home');
            });
    }

    $scope.toggleCaregiver = () => {
        $rootScope.caregiver = !$rootScope.caregiver
        TimerFactory.clearAll();
    }

});
