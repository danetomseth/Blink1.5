core.config(function($stateProvider){
    $stateProvider.state('signup', {
        url: '/signup',
        controller: 'SignupCtrl',
        templateUrl: 'templates/signup.html'
    });
});


core.controller('SignupCtrl', function($state, $scope, AuthService, SidebarFactory){
    $scope.signup = {};
    $scope.error = null;

    $scope.submit = () => {
        $scope.error = null;

        AuthService.signup($scope.signup)
        .then((user) => $state.go('home'))
    }
});
