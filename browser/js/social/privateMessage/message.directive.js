core.directive('blPrivateMessage', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/messages.html',
        controller: 'MessageCtrl'
    }
});
