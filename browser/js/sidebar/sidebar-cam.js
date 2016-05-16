core.directive('blSidebarWebcam', function(SidebarFactory, PositionFactory, $rootScope, WebcamFactory, TrackingFactory, TimerFactory, $mdSidenav) {
    return {
        restrict: 'E',
        controller: 'MainCtrl',
        templateUrl: 'templates/sidebar-webcam.html',
        link: function(scope) {

            var webcamWidth = angular.element(document.getElementById('sidebar-webcam-container'));
            scope.containerHeight = webcamWidth[0].clientWidth * .75 + 'px';
            scope.videoWidth = (webcamWidth[0].clientWidth * 2) + 'px';
            scope.videoHeight = (webcamWidth[0].clientWidth * 2) * 0.75 + 'px';

            var video = document.getElementById('sidebar-webcam');
            var canvas = document.getElementById("sidebar-canvas");

            console.log('first');

            // scope.$on('$viewContentLoaded', function() {
            //     console.log('loaded');
            //     var can = angular.element(document.getElementById('canvas-overlay'));
            //     console.log(can[0].clientHeight);
            //     var canvasX = (can[0].clientWidth / 3.1);
            //     var canvasY = (can[0].clientHeight / 5);


            //     ctx.strokeStyle = "green";
            //     ctx.strokeRect(canvasX, canvasY, 150, 160);


            //     ctx.strokeStyle = "red";
            //     ctx.strokeRect(150, 110, 150, 140);
            // });

            scope.$watch('$viewContentLoaded', function() {
                var boundingBox = document.getElementById("canvas-overlay");
                var ctx = boundingBox.getContext("2d");
                console.log('loaded');
                var can = angular.element(document.getElementById('canvas-overlay'));
                console.log(can[0].clientHeight);
                var canvasX = (can[0].clientWidth / 3.2);
                var canvasY = (can[0].clientHeight / 5);
                let boundArray = [canvasX, canvasY, 160, 160];


                ctx.strokeStyle = "blue";
                ctx.strokeRect(canvasX, canvasY, 160, 160);

                TrackingFactory.startTracking(canvas, video, boundArray);
                WebcamFactory.startWebcam(video);
            });


            // ctx.strokeStyle = "green";
            // ctx.strokeRect(160, 110, 140, 140);






            // TrackingFactory.startTracking(canvas, video);
            // WebcamFactory.startWebcam(video);


        }
    }
});