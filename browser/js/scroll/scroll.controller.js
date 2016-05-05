core.config(function ($stateProvider) {
    $stateProvider.state('scroll', {
        url: '/scroll',
        controller: 'ScrollCtrl',
        templateUrl: 'templates/scroll.html'
    });
});

core.controller('ScrollCtrl', function($state, $scope, $rootScope) {
    // Keep references to the stream and tracker
    $scope.videoStream;
    $scope.ctracker;

    // Disables video stream and clmTracker when leaving the state
    $rootScope.$on('$stateChangeStart', function() {
        $scope.videoStream.getVideoTracks()[0].stop();
        $scope.ctracker.stop();
    });
});
