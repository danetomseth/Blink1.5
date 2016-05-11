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

            // let count = 0;
            // scope.selectedLink = 0;
            // //var video;
            // var video = document.getElementById('sidebar-webcam');
            // var canvas = document.getElementById("sidebar-canvas");

            // TrackingFactory.startTracking(canvas, video);
            // WebcamFactory.startWebcam(video);

            // function linkIterator() {
            //     scope.selectedLink = SidebarFactory.moveSelected();
            //     scope.$digest();
            // }

            // function setZero() {
            //     var converge = TrackingFactory.convergence();
            //     if (converge < 300) {
            //         count++;
            //         if (count > 20) {
            //             TimerFactory.calibrationFinished();
            //             scope.browZero();
            //         }
            //     } else {
            //         count = 0;
            //     }
            // }

            // function goToPage() {
            //     TimerFactory.clearAll();
            //     SidebarFactory.changeState();
            // }

            // function readPositions() {
            //     var positions = TrackingFactory.getPositions();
            //     if (positions) {
            //         if (PositionFactory.browCompare(positions)) {
            //             goToPage();
            //         }
            //     }
            // }

            // scope.local.browZero = function() {
            //     var positions = TrackingFactory.getPositions();
            //     PositionFactory.setBrowZero(positions);
            //     TimerFactory.startReading(readPositions, 50);
            //     TimerFactory.moveCursor(linkIterator, 1000);
            // }

            // scope.local.runFunc = function() {
            //     console.log('Runnnninggg')
            // }
            // console.log('local', scope.local)

            // scope.local.selectLinks = () => {
            //     TimerFactory.moveCursor(linkIterator, 750);
            // }

            // let videoStatus = () => {
            //     if ($rootScope.videoActive) {
            //         TimerFactory.videoReady();
            //         TrackingFactory.drawLoop();
            //         //TimerFactory.calibrate(setZero, 50);
            //     }
            // }
            // TimerFactory.videoStatus(videoStatus, 100);


        }
    }
});