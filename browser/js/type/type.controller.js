core.config(function ($stateProvider) {
    $stateProvider.state('type', {
        url: '/type',
        controller: 'TypeCtrl',
        templateUrl: 'templates/type.html',
        onEnter: function(TypeFactory) {
            TypeFactory.active = true;
        }
    });
});

core.controller('TypeCtrl', function($scope, ConstantsFactory) {

    // Key-value pairs for keyboard speed based on user's settings
    $scope.start = function() {
        ConstantsFactory.increase()
    }

    $scope.stop = function() {
        ConstantsFactory.decrease()
    }

});



