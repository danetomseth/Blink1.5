core.controller('SettingsCtrl', function($scope, user, SettingsFactory, IterateFactory) {

    $scope.name = user.firstName + " " + user.lastName;
    $scope.keyboardSpeed = user.keyboardSpeed;
    $scope.trackingFeature = user.trackingFeature;
    $scope.selectedTab; // Defaults to 0
    $scope.highlighted;

    $scope.speeds = [0, 1, 2, 3, 4, 5];
    $scope.features = ['eyes', 'eyebrows', 'mouth'];

    $scope.setSpeed = function(speed) {
        // Want to get rid of this function - just need front end to update to show the user's current selection
        // Set speed on front-end
        $scope.keyboardSpeed = speed;
    };

    $scope.setFeatures = function(feature) {
        // Want to get rid of this function - just need front end to update to show the user's current selection
        // Set tracking feature on front-end
        $scope.trackingFeature = feature;
    };

    $scope.$watchCollection(function() {
        return IterateFactory.scopeValue;
    }, function(newVal, oldVal) {
        // if (typeof newVal !== 'undefined') { ?? not sure if i need this
            $scope.selectedTab = IterateFactory.scopeValue[0];
            $scope.highlighted = IterateFactory.scopeValue[1];
        // }
    });

});
