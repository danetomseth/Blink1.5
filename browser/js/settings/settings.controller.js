core.controller('SettingsCtrl', function($scope, SettingsFactory, Session) {

    $scope.user = Session.user;
    $scope.name = Session.user.firstName + " " + Session.user.lastName;
    $scope.selections = SettingsFactory.selections;

    $scope.speeds = [1, 2, 3, 4, 5];
    $scope.features = ['eyes', 'eyebrows', 'mouth'];

});
