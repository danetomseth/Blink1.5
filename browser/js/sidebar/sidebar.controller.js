core.controller('SidebarCtrl', function($scope, $state, $rootScope) {
    //$scope.showNav = $rootScope.showNav;
    // $scope.$watch('showNav', function(newValue, oldValue) {
    // 	console.log('watching');
    //     //$scope.counter = $scope.counter + 1;
    // });
});


core.run(function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        if (toState.name === 'home') {
            console.log("entering home state");
            $rootScope.showNav = true;
            //$rootScope.$digest();
        } else {
            console.log('not home');
            $rootScope.showNav = false;
        }
    });
});