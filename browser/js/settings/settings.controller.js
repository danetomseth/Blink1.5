core.config(function($stateProvider) {
    $stateProvider.state('settings', {
        url: '/settings',
        controller: 'SettingsCtrl',
        templateUrl: 'templates/settings.html',
        resolve: {
            user: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    });

    $stateProvider.state('settings.keyboard', {
        url: '/',
        templateUrl: 'templates/settings.keyboard.html'
    })

    $stateProvider.state('settings.features', {
        url: '/',
        templateUrl: 'templates/settings.features.html'
    })
});

core.controller('SettingsCtrl', function($scope, user, SettingsFactory) {
    $scope.name = user.firstName + " " + user.lastName;

    $scope.selected;

    $scope.speeds = [0,1,2,3,4,5];
    $scope.features = ['eyes','eyebrows','mouth'];

    $scope.setSpeed = function(speed) {
        $scope.selected = speed;
        SettingsFactory.editSettings({keyboardSpeed: speed}, user);
    };

    $scope.setFeatures = function(feature) {
        $scope.selected = feature;
        SettingsFactory.editSettings({trackingFeature: feature}, user);
    };

});

core.factory('SettingsFactory', function($http) {
 return {
    editSettings: (obj, user) => {
        return $http.put('/api/users/' + user._id, obj)
        .then((updatedUser) => updatedUser)
    }
 }
});
