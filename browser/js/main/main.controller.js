core.controller('MainCtrl', function($scope, $q, $state, $rootScope, IterateFactory, TimerFactory, TrackingFactory) {

    $scope.sidebar = {};

    $scope.stopTacking = () => {
        TimerFactory.clearTracking();
        $scope.trackingStopped = true;
    }

    $scope.runFunc = () => {
        console.log('in func!', $scope.sidebar);
        $scope.sidebar.selectLinks();
    }

    //dont really need any of this at the moment
    // let videoStatus = () => {
    //     if ($rootScope.videoActive) {
    //         console.log('video ready');
    //         TimerFactory.videoReady();
    //         TrackingFactory.startDrawing();
    //     }
    // }

   // TimerFactory.videoStatus(videoStatus, 100);

});
