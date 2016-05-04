core.controller("CameraCtrl", function($scope, ClmFactory) {
    //initiates webcam

    //const context = canvas.getContext("2d");

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

    //move this to errorFactory
    var errorCallback = function(e) {
        console.log('Cant find camera!', e);
    };

    const video = document.getElementById('webcam');
    var ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(video);
    const canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    if (navigator.getUserMedia) {
        ClmFactory.initialize(canvas, video, ctracker, context);
        navigator.getUserMedia({
            video: true
        }, function(stream) {
            video.src = window.URL.createObjectURL(stream);
            console.log('video load');
            // start tracking position
            ClmFactory.positionLoop();
            ClmFactory.drawLoop();
        }, errorCallback);
    } else {
        console.log('cannot find cam');
        alert('Cannot connect');
    }

    $scope.zero = () => {
        ClmFactory.zero();
    }

});
