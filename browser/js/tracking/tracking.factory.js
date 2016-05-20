'use strict';

core.factory('TrackingFactory', function($rootScope) {
    let canvas;
    let context;
    let tracker;
    $rootScope.trackerInitialized = false;

    let trackObj = {};

    trackObj.startTracking = (canvasElem, video, boundingBox) => {
        //new tracker
        tracker = new clm.tracker({searchWindow: 5});
        tracker.init(pModel);
        canvas = canvasElem;
        context = canvas.getContext("2d");
        //helps remove the error when tracker first loads

        setTimeout(function() {
            tracker.setResponseMode("blend", ["raw", "sobel"]);
            tracker.start(video, boundingBox);
            $rootScope.$broadcast("trackerInitialized")
        }, 2000);

    };

    trackObj.drawLoop = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        tracker.draw(canvas);
    };
    trackObj.convergence = () => {
        return tracker.getConvergence();
    }

    trackObj.getPositions = () => {
        return tracker.getCurrentPosition();
    };

    return trackObj;
});
