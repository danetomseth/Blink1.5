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
