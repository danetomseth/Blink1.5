core.controller('SettingsCtrl', function($scope, user, SettingsFactory, IterateFactory) {

    $scope.user = user;
    $scope.name = user.firstName + " " + user.lastName;
    $scope.selectedTab; // Defaults to 0
    $scope.highlighted;

    $scope.speeds = [0, 1, 2, 3, 4, 5];
    $scope.features = ['eyes', 'eyebrows', 'mouth'];

    $scope.$watchCollection(function() {
        return IterateFactory.scopeValue;
    }, function(newVal, oldVal) {
            $scope.selectedTab = IterateFactory.scopeValue[0];
            $scope.highlighted = IterateFactory.scopeValue[1];
    });

});
