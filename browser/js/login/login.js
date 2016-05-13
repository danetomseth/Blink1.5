app.config(function($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.config(function($stateProvider) {

    $stateProvider.state('logout', {
        url: '/logout',
        controller: function(AuthService, $state) {
            AuthService.logout().then(function() {
                $state.go('home');
            });
        }
    });

});

app.controller('LoginCtrl', function($scope, AuthService, $state, SidebarFactory) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function(loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function() {
            $state.go('home');
        }).catch(function() {
            $scope.error = 'Invalid login credentials.';
        });

    };


});
