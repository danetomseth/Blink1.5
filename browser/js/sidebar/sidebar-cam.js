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

            //position we
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




            scope.$watch('$viewContentLoaded', function() {
                var boundingBox = document.getElementById("canvas-overlay");
                var ctx = boundingBox.getContext("2d");
                var can = angular.element(document.getElementById('canvas-overlay'));
                var middleX = containerWidth - (containerWidth / 3);
                var middleY = (containerWidth * .75) - ((containerWidth / 3) * .75);
                var canvasWidth = (containerWidth / 3) * 2;
                var canvasHeight = ((containerWidth / 3) * .75) * 2.2;
                let boundArray = [middleX, middleY, canvasWidth, canvasHeight];

                ctx.strokeStyle = "blue";
                ctx.strokeRect(middleX, middleY, canvasWidth, canvasHeight);

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