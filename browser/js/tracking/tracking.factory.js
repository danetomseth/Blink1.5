'use strict';

core.factory('TrackingFactory', function($rootScope, $state) {
    let canvas;
    let context;
    let tracker;
    $rootScope.trackerInitialized = false;
    let drawing = false;

    let trackObj = {};
    trackObj.startTracking = (canvasElem, video, boundingBox) => {
        //new tracker
        tracker = new clm.tracker({searchWindow: 5});
        tracker.init(pModel);
        canvas = canvasElem;
        context = canvas.getContext("2d");
        //helps remove the error when tracker first loads
        tracker.setResponseMode("blend", ["raw", "sobel"]);
            // tracker.start(video, boundingBox);
            tracker.start(video);
            trackObj.startDrawing();
            $rootScope.trackerInitialized = true;
        // setTimeout(function() {
        //     tracker.setResponseMode("blend", ["raw", "sobel"]);
        //     // tracker.start(video, boundingBox);
        //     tracker.start(video);
        //     trackObj.startDrawing();
        //     $rootScope.trackerInitialized = true;
        // }, 2000);

    };

    trackObj.drawLoop = () => {
        requestAnimationFrame(trackObj.drawLoop);
        context.clearRect(0, 0, canvas.width, canvas.height);
        tracker.draw(canvas);
    };


    trackObj.startDrawing = () => {
        if (!drawing) {
            trackObj.drawLoop();
            drawing = true;
        }
    }


    trackObj.getParams = () => {
        return tracker.getCurrentParameters();
    }



    trackObj.convergence = () => {
        return tracker.getConvergence();
    }

    trackObj.getPositions = () => {
        return tracker.getCurrentPosition();
    };

    trackObj.endTracking = () => {
        if (tracker) tracker.stop();
        context.clearRect(0, 0, canvas.width, canvas.height);
        $rootScope.drawing = false;
        drawing = false;
        $rootScope.videoActive = false
    };

    trackObj.setZero = () => {
        var converge = TrackingFactory.convergence();
        if (converge < 300) {
            count++;
            if (count > 20) {
                TimerFactory.calibrationFinished();

            }
        } else {
            count = 0;
        }
    }

    return trackObj
});
