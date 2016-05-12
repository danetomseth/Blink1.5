core.config(function ($stateProvider) {
    $stateProvider.state('type', {
        url: '/type',
        controller: 'TypeCtrl',
        templateUrl: 'templates/type.html',
        resolve: {
            user: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
        },
        onEnter: function(IterateFactory) {
        	//this starts nav iteration on home page
        	//IterateFactory.zero('type');
        }
    });
});

core.controller('TypeCtrl', function($state, $scope, user, IterateFactory, TimerFactory) {
    $scope.delay; // keyboard iteration speed

    // Key-value pairs for keyboard speed based on user's settings
    $scope.start = function() {
        IterateFactory.zero('type');
    }

    $scope.stop = function() {
        TimerFactory.clearTracking();
    }
    // const translateDelay = {
    //     0: 1750,
    //     1: 1500,
    //     2: 1250,
    //     3: 1000,
    //     4: 750,
    //     5: 500
    // }

    if (user) { $scope.delay = translateDelay[user.keyboardSpeed] } else { $scope.delay = translateDelay[3] };

});



