//this sets all of timer dependent functions to the same intervals to clear on state change

core.factory('TimerFactory', function($rootScope,$state, $interval, $timeout, TrackingFactory) {
    var calibrateInt;
    var cursorInt;
    var positionInt;
    var videoInt;

    var readFunc;
    var cursorFunc;

    return {
        startReading: (iterator, delay, callback) => {
            readFunc = function() {
                    positionInt = $interval(iterator, delay, 0, true, callback);
                }
            readFunc();
        },
        moveCursor: (iterator, delay) => {
            cursorFunc = function() {
                cursorInt = $interval(iterator, delay);
            }
            cursorFunc();
        },
        calibrate: (iterator, delay, page) => {
            calibrateInt = $interval(iterator, delay, 0, true, page);
        },
        videoStatus: (iterator, delay) => {
            videoInt = $interval(iterator, delay);
        },
        clearAll: () => {
            if (angular.isDefined(calibrateInt)) {
                $interval.cancel(calibrateInt);
                calibrateInt = null;
            }
            if (angular.isDefined(cursorInt)) {
                $interval.cancel(cursorInt);
                cursorInt = null;
            }
            if (angular.isDefined(positionInt)) {
                $interval.cancel(positionInt);
                positionInt = null;
            }
            if (angular.isDefined(videoInt)) {
                $interval.cancel(videoInt);
                videoInt = null;
            }
        },
        clearTracking: () => {
            if (angular.isDefined(calibrateInt)) {
                $interval.cancel(calibrateInt);
                calibrateInt = null;
            }
            if (angular.isDefined(cursorInt)) {
                $interval.cancel(cursorInt);
                cursorInt = null;
            }
            if (angular.isDefined(positionInt)) {
                $interval.cancel(positionInt);
                positionInt = null;
            }
        },
        pauseIteration: (delay) => {
            //need to refeactor this

            // if (angular.isDefined(cursorInt)) {
            //     $interval.cancel(positionInt);
            //     $interval.cancel(cursorInt);
            // }
            // $timeout(function() {
            //     cursorFunc();
            // }, delay);
        },
        //we know that the webcam is loaded and can start tracking
        videoReady: () => {
            $interval.cancel(videoInt);
        },
        calibrationFinished: () => {
            $interval.cancel(calibrateInt);
        }
    }
});
