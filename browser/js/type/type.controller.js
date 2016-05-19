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
        onEnter: function(KeyboardFactory) {
            KeyboardFactory.active = true;
        	//this starts nav iteration on type page
            // setTimeout(function() {
            //     IterateFactory.iterate('type');
            // }, 750);
        }
    });
});

core.controller('TypeCtrl', function($state, $scope, user, IterateFactory, TimerFactory, ConstantsFactory) {
    $scope.delay; // keyboard iteration speed

    // Key-value pairs for keyboard speed based on user's settings
    $scope.start = function() {
        ConstantsFactory.increase()
    }

    $scope.stop = function() {
        ConstantsFactory.decrease()
    }

});



