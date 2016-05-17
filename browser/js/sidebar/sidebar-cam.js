core.directive('blSidebarWebcam', function(SidebarFactory, PositionFactory, $rootScope, WebcamFactory, TrackingFactory, TimerFactory, $mdSidenav) {
    return {
        restrict: 'E',
        controller: 'MainCtrl',
        templateUrl: 'templates/sidebar-webcam.html',
        link: function(scope) {

            var containerWidth = angular.element(document.getElementById('sidebar-webcam-container'))[0].clientWidth

            scope.containerHeight = containerWidth * .75 + 'px';
            scope.videoWidth = (containerWidth * 2) + 'px';
            scope.videoHeight = (containerWidth * 2) * 0.75 + 'px';

            var positionSetWidth = (containerWidth / -2) + 'px';
            var positionSetHeight = (containerWidth / -2) * .75 + 'px';


            var video = document.getElementById('sidebar-webcam');
            var canvas = document.getElementById("sidebar-canvas");

            scope.webcamCss = {
                'top': positionSetHeight,
                'left': positionSetWidth
            }

            scope.canvasCss = {
                'top': positionSetHeight,
                'left': positionSetWidth
            }

            WebcamFactory.startWebcam(video);



            //All of this logic is to set bounding box canvas
            scope.$watch('$viewContentLoaded', function() {
                var boundingBox = document.getElementById("canvas-overlay");
                var ctx = boundingBox.getContext("2d");

                var middleX = containerWidth - (containerWidth / 3.5);
                var middleY = (containerWidth * .75) - ((containerWidth / 3.1));
                var canvasWidth = (containerWidth / 3.5) * 2;
                var canvasHeight = ((containerWidth / 3) * .75) * 2.4;

                ctx.strokeStyle = "#82ff32";
                ctx.strokeRect(middleX, middleY, canvasWidth, canvasHeight);

                TrackingFactory.startTracking(canvas, video, [middleX, middleY, canvasWidth, canvasHeight]);


            });

        }
    }
});