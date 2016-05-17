core.controller('MainCtrl', function($scope, $state, $rootScope, IterateFactory, TimerFactory, TrackingFactory) {
    $scope.$on('$viewContentLoaded', function() {

    });

   

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        //TimerFactory.clearTracking();
        // if(toState.name === 'type') {
        //     IterateFactory.zero('type')
        // }
        // if(toState.name === 'home') {
        //     IterateFactory.zero('nav')
        // }
    });

    $scope.sidebar = {};


    

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
