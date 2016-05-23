core.config(function($stateProvider) {
    $stateProvider.state('corners', {
        url: '/grid',
        controller: 'CornersCtrl',
        templateUrl: 'templates/corners.html'
    });
});

core.controller('CornersCtrl', function($scope, CornersFactory, CornersCalibrate) {


    // consider moving this into calibration function
    // let count = 0
    // let calibrated = false;
    // console.log("ENTERING")

    // function pupilCheck(){
    //     // IterateFactory.zero('corners');
    //     var converge = TrackingFactory.convergence();
    //     var positions = TrackingFactory.getPositions();
    //     if (converge < 300) {
    //         count++;
    //         if (count > 30) {
    //             PositionFactory.setPupilZero(positions);
    //             calibrated = true
    //         }
    //     } else {
    //         count = 0;
    //     }
    //     if(!calibrated){
    //         requestAnimationFrame(pupilCheck)
    //     }
    // }
    // pupilCheck()

});
