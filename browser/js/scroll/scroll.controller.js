core.config(function ($stateProvider) {
    $stateProvider.state('scroll', {
        url: '/scroll',
        controller: 'ScrollCtrl',
        templateUrl: 'templates/scroll.html',
        resolve: {
            user: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    });
});

core.controller('ScrollCtrl', function($state, $scope, user) {
    $scope.delay; // keyboard iteration speed

    // Key-value pairs for keyboard speed based on user's settings
    const translateDelay = {
        5: 500,
        4: 750,
        3: 1000,
        2: 1250,
        1: 1500,
        0: 1750
    }

    if (user) { $scope.delay = translateDelay[user.keyboardSpeed] } else { $scope.delay = 3 };

});




