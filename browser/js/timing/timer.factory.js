// //this sets all of timer dependent functions to the same intervals to clear on state change

core.factory('TimerFactory', function($rootScope,$state, $interval, $timeout) {
//     var calibrateInt;
//     var cursorInt;
//     var positionInt;
//     var videoInt;

//     var readFunc;
//     var cursorFunc;

//     return {
//         startReading: (iterator, delay, callback) => {
//             console.log("startReading")
//             readFunc = function() {
//                     positionInt = $interval(iterator, delay, 0, true, callback);
//                 }
//             readFunc();
//         },
//         moveCursor: (iterator, delay) => {
//             console.log("moveCursor")
//             cursorFunc = function() {
//                 cursorInt = $interval(iterator, delay);
//             }
//             cursorFunc();
//         },
//         calibrate: (iterator, delay, page) => {
//             console.log("calibrate")
//             calibrateInt = $interval(iterator, delay, 0, true, page);
//         },
//         videoStatus: (iterator, delay) => {
//             console.log("videoStatus")
//             videoInt = $interval(iterator, delay);
//         },
//         clearAll: () => {
//             console.log('clearAll')
//             if (angular.isDefined(calibrateInt)) {
//                 $interval.cancel(calibrateInt);
//                 calibrateInt = null;
//             }
//             if (angular.isDefined(cursorInt)) {
//                 $interval.cancel(cursorInt);
//                 cursorInt = null;
//             }
//             if (angular.isDefined(positionInt)) {
//                 $interval.cancel(positionInt);
//                 positionInt = null;
//             }
//             if (angular.isDefined(videoInt)) {
//                 $interval.cancel(videoInt);
//                 videoInt = null;
//             }
//         },
//         clearTracking: () => {
//             console.log("clearTracking")
//             if (angular.isDefined(calibrateInt)) {
//                 $interval.cancel(calibrateInt);
//                 calibrateInt = null;
//             }
//             if (angular.isDefined(cursorInt)) {
//                 $interval.cancel(cursorInt);
//                 cursorInt = null;
//             }
//             if (angular.isDefined(positionInt)) {
//                 $interval.cancel(positionInt);
//                 positionInt = null;
//             }
//         },
//         pauseIteration: (delay) => {
//             //need to refeactor this

//             // if (angular.isDefined(cursorInt)) {
//             //     $interval.cancel(positionInt);
//             //     $interval.cancel(cursorInt);
//             // }
//             // $timeout(function() {
//             //     cursorFunc();
//             // }, delay);

//         },
//         //we know that the webcam is loaded and can start tracking
//         videoReady: () => {
//             console.log("videoReady")
//             $interval.cancel(videoInt);
//         },
//         calibrationFinished: () => {
//             console.log("calibrationFinished")
//             $interval.cancel(calibrateInt);
//         }
//     }

return {}
});
