core.controller('SidebarCtrl', function($scope, $state, $rootScope, AuthService, ActionFactory) {


    $scope.logOut = function() {
        return AuthService.logout()
            .then(function() {
                $state.go('home');
            });
    }

    let lastBlinkTime = 0;


    

    $scope.toggleCaregiver = () => {
        $rootScope.caregiver = !$rootScope.caregiver
        ActionFactory.stopEvents();
    }

    $scope.blink = () => {
        let blinkDt = Date.now() - lastBlinkTime;
        lastBlinkTime = Date.now();
        if (blinkDt < 250) {
            return false
        } 
        else {
            if(blinkDt <= 500) {
                console.log('doubleeeee');
                $rootScope.$broadcast('doubleBlink', 'Event');
            }
            else {
                console.log('singleee');
                $rootScope.$broadcast('singleBlink', 'Event');
            }
        }
    }

    $scope.move = () => {
        $rootScope.$broadcast('iterate', 'Event');
    }

    $scope.dblBlink = () => {
        $rootScope.$broadcast('doubleBlink', 'Event');
    }

});