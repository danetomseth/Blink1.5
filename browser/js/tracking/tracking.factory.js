'use strict';

core.factory('TrackingFactory', function($rootScope) {
    let canvas;
    let context;
    let tracker;

    let trackObj = {};
    trackObj.startTracking = (canvasElem, video) => {
        //new tracker
        tracker = new clm.tracker();
        tracker.init(pModel);
        tracker.start(video);

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

    trackObj.convergence = () => {
        return tracker.getConvergence();
    }

    trackObj.getPositions = () => {
        return tracker.getCurrentPosition();
    };

    trackObj.endTracking = () => {
        tracker.stop();
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
