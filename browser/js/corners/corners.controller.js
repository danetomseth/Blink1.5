core.config(function ($stateProvider) {
    $stateProvider.state('corners', {
        url: '/corners',
        controller: 'CornersCtrl',
        templateUrl: 'templates/corners.html',
        onEnter: function (TrackingFactory, PositionFactory) {
            // consider moving this into calibration function
            let count = 0
            let calibrated = false;
            console.log("ENTERING")

            function pupilCheck(){
                var converge = TrackingFactory.convergence();
                var positions = TrackingFactory.getPositions();
                if (converge < 300) {
                    count++;
                    if (count > 30) {
                        PositionFactory.setPupilZero(positions);
                        calibrated = true
                    }
                } else {
                    count = 0;
                }
                if(!calibrated){
                    requestAnimationFrame(pupilCheck)
                }
            }
            pupilCheck()
        }
    });
});

core.controller('CornersCtrl', function($scope, CornersFactory, IterateFactory) {
});
