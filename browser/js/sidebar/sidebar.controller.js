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
        console.log('sidebar blink');
        $rootScope.$broadcast('singleBlink', 'Event');
    }

    $scope.move =() => {
        console.log('sidebar move');
        $rootScope.$broadcast('iterate', 'Event');
    }

});
