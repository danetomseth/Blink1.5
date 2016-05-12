core.controller('SettingsCtrl', function($scope, user, SettingsFactory, IterateFactory) {
    $scope.name = user.firstName + " " + user.lastName;
    $scope.keyboardSpeed = user.keyboardSpeed;
    $scope.trackingFeature = user.trackingFeature;
    $scope.selectedIndex; // Defaults to 0
    // $scope.scopeValue = 3;

    $scope.selected;

    $scope.speeds = [0, 1, 2, 3, 4, 5];
    $scope.features = ['eyes', 'eyebrows', 'mouth'];

    $scope.setSpeed = function(speed) {
        $scope.selected = speed;
        // Set speed on user model
        SettingsFactory.editSettings({ keyboardSpeed: speed }, user);
        // Set speed on front-end
        $scope.keyboardSpeed = speed;
    };

    $scope.setFeatures = function(feature) {
        $scope.selected = feature;
        // Set tracking feature on user model
        SettingsFactory.editSettings({ trackingFeature: feature }, user);
        // Set tracking feature on front-end
        $scope.trackingFeature = feature;
    };

    $scope.$watch(function() {
        return IterateFactory.settingsValue;
    }, function(newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.selectedIndex = IterateFactory.settingsValue;
        }
    });

});
