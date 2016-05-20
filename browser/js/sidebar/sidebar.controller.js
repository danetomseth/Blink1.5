core.controller('SidebarCtrl', function($scope, $state, $rootScope, AuthService, ActionFactory) {


    $scope.logOut = function() {
        return AuthService.logout()
            .then(function() {
                $state.go('home');
            });
    }

    $scope.toggleCaregiver = () => {
        $rootScope.caregiver = !$rootScope.caregiver
        ActionFactory.stopEvents();
    }

    $scope.blink =() => {
        $rootScope.$broadcast('singleBlink', 'Event');
    }

    $scope.move =() => {
        $rootScope.$broadcast('iterate', 'Event');
    }

});
