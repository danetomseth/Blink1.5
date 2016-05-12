core.config(function ($stateProvider) {
    $stateProvider.state('scroll', {
        url: '/scroll',
        controller: 'ScrollCtrl',
        templateUrl: 'templates/scroll.html',
        resolve: {
            user: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
        },
        onEnter: function(IterateFactory) {
        	//this starts nav iteration on home page
        	IterateFactory.zero('scroll');
        }
    });
});

core.controller('ScrollCtrl', function($state, $scope, user) {
    $scope.delay; // keyboard iteration speed

    // Key-value pairs for keyboard speed based on user's settings
    const translateDelay = {
        0: 1750,
        1: 1500,
        2: 1250,
        3: 1000,
        4: 750,
        5: 500
    }

    if (user) { $scope.delay = translateDelay[user.keyboardSpeed] } else { $scope.delay = translateDelay[3] };

});



