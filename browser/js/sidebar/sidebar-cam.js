core.directive('blSidebarWebcam', function(SidebarFactory, PositionFactory, $rootScope, WebcamFactory, TrackingFactory, TimerFactory, $mdSidenav) {
    return {
        restrict: 'E',
        controller: 'MainCtrl',
        scope: {
            local: '='
        },
        templateUrl: 'templates/sidebar-webcam.html',
        link: function(scope) {
            
            var webcamWidth = angular.element(document.getElementById('sidebar-webcam-container'));
            scope.containerHeight = webcamWidth[0].clientWidth * .75 + 'px';
            scope.videoWidth = (webcamWidth[0].clientWidth * 2) + 'px';
            scope.videoHeight = (webcamWidth[0].clientWidth * 2) * 0.75 + 'px';

            var video = document.getElementById('sidebar-webcam');
            var canvas = document.getElementById("sidebar-canvas");

            TrackingFactory.startTracking(canvas, video);
            WebcamFactory.startWebcam(video);


        }
    }
});