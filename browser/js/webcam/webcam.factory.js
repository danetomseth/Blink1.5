core.factory('WebcamFactory', function($rootScope, $state) {
    let errorCallback = function(e) {
        console.log('Error connecting to source!', e);
        $state.reload();
    };
    $rootScope.videoActive = false;
    return {
        startWebcam: (videoElem) => {
            //starts webcam
            if (Modernizr.getusermedia) {
                var gUM = Modernizr.prefixed('getUserMedia', navigator);
                gUM({
                    video: true
                }, function(stream) {
                    $rootScope.videoStream = stream;
                    $rootScope.videoActive = true;
                    videoElem.src = window.URL.createObjectURL($rootScope.videoStream);
                }, errorCallback);

            }
        },
        endWebcam: () => {
        	console.log('stopping video');
        	$rootScope.videoStream.getVideoTracks()[0].stop();
        }
    }
});
