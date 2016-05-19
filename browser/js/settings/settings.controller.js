core.controller('SettingsCtrl', function($scope, $rootScope, user, SettingsFactory, IterateFactory) {

    $scope.user = user;
    $scope.name = user.firstName + " " + user.lastName;
    $scope.selections = SettingsFactory.selections; // Defaults to 0
    // $scope.highlighted;

    $scope.speeds = [0, 1, 2, 3, 4, 5];
    $scope.features = ['eyes', 'eyebrows', 'mouth'];



    // $scope.$watchCollection(function() {
    //     return SettingsFactory.selections;
    // }, function(newVal, oldVal) {
    //         $scope.selectedTab = IterateFactory.scopeValue[0];
    //         $scope.highlighted = IterateFactory.scopeValue[1];
    // });

});
