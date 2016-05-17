'use strict';

core.factory('TrackingFactory', function($rootScope, $state) {
    let canvas;
    let context;
    let tracker;
    let drawing = false;

    let trackObj = {};
    trackObj.startTracking = (canvasElem, video, boundingBox) => {
        


        
        //new tracker
        tracker = new clm.tracker();
        tracker.init(pModel);
        tracker.setResponseMode("blend", ["raw", "sobel"]);
        tracker.start(video, boundingBox);


        //set canvas
        canvas = canvasElem;
        context = canvas.getContext("2d");
    };

    trackObj.drawLoop = () => {
        if ($rootScope.videoActive) {
            requestAnimationFrame(trackObj.drawLoop);
            context.clearRect(0, 0, canvas.width, canvas.height);
            tracker.draw(canvas);
        }
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
        console.log('end tracking', $state.$current);
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