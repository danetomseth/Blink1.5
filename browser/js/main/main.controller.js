core.controller('MainCtrl', function($scope, $state, $rootScope, TimerFactory, TrackingFactory) {
    $scope.$on('$viewContentLoaded', function() {
   
    });

    $scope.sidebar = {};


    $scope.stopWebcam = () => {
        TimerFactory.clearAll();
    }

    $scope.stopTacking = () => {
        TimerFactory.clearTracking();
        $scope.trackingStopped = true;
    }

    $scope.runFunc = () => {
        console.log('in func!', $scope.sidebar);
        $scope.sidebar.selectLinks();
    }

    let videoStatus = () => {
        if ($rootScope.videoActive) {
            TimerFactory.videoReady();
            TrackingFactory.drawLoop();
        }
    }
    TimerFactory.videoStatus(videoStatus, 100);
});