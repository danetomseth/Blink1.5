core.factory('CornersCalibrate', function($rootScope, $interval, PositionFactory, TrackingFactory) {
    let calibrateObj = {};
    let eyePos = [0, 0];
    let frameId;
    let readyToRead = false;
    let readCount = 0;
    let count = 0;
    let eyeXSum = 0;
    let eyeYSum = 0;
    let zeroXPos;
    let zeroYPos;
    let zeroXNeg;
    let zeroYNeg;
    let centerX;
    let centerY;
    let calibrationArray = [];
    let xDiffAvg = [0, 0, 0];
    let yDiffAvg = [0, 0, 0];
    let tempArr = [];
    let xThresh = [0, 0];
    let yThresh = [0, 0];


    calibrateObj.selectedBox = 0;
    calibrateObj.calibrationSet = false;

    calibrateObj.calBoxes = ['X', '', '', '', ''];

    let boxInt;

    let sumArray = (arr) => {
        let xAvg = 0;
        let yAvg = 0;
        arr.forEach((elem) => {
            xAvg += elem[0];
            yAvg += elem[1];
        })
        xAvg = xAvg / arr.length;
        yAvg = yAvg / arr.length;
        return [xAvg, yAvg];
    }


    let findDiff = (box) => {
        let xDiff = centerX - calibrationArray[box][0];
        let yDiff = centerY - calibrationArray[box][1];
        return [xDiff, yDiff];
    }

    let setZeros = () => {

        centerX = calibrationArray[2][0];
        centerY = calibrationArray[2][1];

        zeroXNeg = ((findDiff(0)[0] + findDiff(3)[0]) / 2);
        zeroYPos = ((findDiff(0)[1] + findDiff(1)[1]) / 2);
        zeroYNeg = ((findDiff(3)[1] + findDiff(4)[1]) / 2);
        zeroXPos = ((findDiff(1)[0] + findDiff(4)[0]) / 2); //this was wrong


        //[0] = negative
        //[1] = positive

        xThresh[0] = ((findDiff(0)[0] + findDiff(3)[0]) / 2) * 0.5;
        xThresh[1] = ((findDiff(1)[0] + findDiff(4)[0]) / 2) * 0.5;

        let xAverage = (Math.abs(xThresh[0]) + xThresh[1]) / 2
        xThresh[0] = -xAverage;
        xThresh[1] = xAverage;

        yThresh[0] = ((findDiff(3)[1] + findDiff(4)[1]) / 2) * 0.3;
        yThresh[1] = ((findDiff(0)[1] + findDiff(1)[1]) / 2) * 0.3;

        let yAverage = (Math.abs(yThresh[0]) + yThresh[1]) / 2

        yThresh[0] = -yAverage;
        yThresh[1] = yAverage;


        // console.log('-x', zeroXNeg);
        // console.log('-y', zeroYNeg);
        // console.log('y', zeroYPos);
        // console.log('x', zeroXPos);
        // console.log('center', centerX, centerY);

        console.log('xThresh', xThresh[0], xThresh[1]);
        console.log('yThresh', yThresh[0], yThresh[1]);

        console.log('AvgX', xAverage);
        console.log('AvgY', yAverage);
        console.log('----------------------');

        calibrateObj.calibrationSet = true;

        // console.log('top right', findDiff(1));


        // console.log('bottom left', findDiff(3));

        // console.log('bottom right', findDiff(4));
    }



    let readDelay = () => {
        readyToRead = false;

        setTimeout(() => {
            readyToRead = true;
        }, 1000);
    }

    let setCalibrationValue = () => {
        if (tempArr.length) {
            let avgReadings = sumArray(tempArr);
            calibrationArray.push(avgReadings);
            tempArr = [];
        }
        readDelay();
    }

    let changeBox = () => {
        readDelay();
        boxInt = $interval(() => {
            setCalibrationValue()
            calibrateObj.selectedBox++;

            if (calibrateObj.selectedBox < calibrateObj.calBoxes.length) {
                calibrateObj.calBoxes = ['', '', '', '', ''];
                calibrateObj.calBoxes[calibrateObj.selectedBox] = 'X'
            } else {
                calibrateObj.calBoxes = ['', '', '', '', ''];

                $interval.cancel(boxInt);
                setZeros()
            }
        }, 3000);
    }
    let avgXDiffs = [
        [],
        [],
        [],
        [],
        []
    ]
    let avgYDiffs = [
        [],
        [],
        [],
        [],
        []
    ]

    let centerCount = 0;
    let xSum = 0;
    let ySum = 0;

    let calibrateValues = () => {
        if (readyToRead) {
            tempArr.push(eyePos);
        }

        if (calibrateObj.calibrationSet) {
            let xDiff = centerX - eyePos[0];
            let yDiff = centerY - eyePos[1];
            xDiffAvg.push(xDiff);
            xDiffAvg.shift();
            xDiff = (xDiffAvg[0] + xDiffAvg[1] + xDiffAvg[2]) / 3;

            yDiffAvg.push(yDiff);
            yDiffAvg.shift();
            yDiff = (yDiffAvg[0] + yDiffAvg[1] + yDiffAvg[2]) / 3;

            if (xDiff < xThresh[0] && yDiff > yThresh[1]) { // LEFT TOP
                calibrateObj.selectedBox = 0;
                avgXDiffs[0].push()
            } else if (xDiff > xThresh[1] && yDiff > yThresh[1]) { // RIGHT TOP
                calibrateObj.selectedBox = 1;
            } else if (xDiff < xThresh[0] && yDiff < yThresh[0]) { // BOTTOM RIGHT
                calibrateObj.selectedBox = 3;
            } else if (xDiff > xThresh[1] && yDiff < yThresh[0]) { // BOTTOM LEFT
                calibrateObj.selectedBox = 4;
            } else {
                calibrateObj.selectedBox = 2;
                if((xThresh[1] / Math.abs(xDiff)) < 0.8 || (yThresh[1] / Math.abs(yDiff)) < 0.8) {
                    avgXDiffs[2].push(xDiff);
                    avgYDiffs[2].push(yDiff);
                    centerCount++;
                }
            }

            if (centerCount > 50) {
                centerCount = 0;
                avgXDiffs[2].forEach((elem) => {
                    xSum += elem;
                })

                avgYDiffs[2].forEach((elem) => {
                    ySum += elem;
                })
                xThresh[0] = -Math.abs(xSum / avgXDiffs[2].length);
                xThresh[1] = Math.abs(xSum / avgXDiffs[2].length);
                yThresh[0] = -Math.abs(ySum / avgYDiffs[2].length);
                yThresh[1] = Math.abs(ySum / avgYDiffs[2].length);
                xSum = 0;
                ySum = 0;
                console.log('Zero Reset!!');
                console.log('xThresh', xThresh[0], xThresh[1]);
                console.log('yThresh', yThresh[0], yThresh[1]);
                console.log('----------------------');
            }
            if(calibrateObj.selectedBox !== 2) {
                avgXDiffs[calibrateObj.selectedBox].push(xDiff);
                avgYDiffs[calibrateObj.selectedBox].push(yDiff);
            }

            count++

            if (count === 2000) {
                calibrateObj.calibrationSet = false;
                for (var i = 0; i < avgXDiffs.length; i++) {
                    xSum = 0;
                    ySum = 0;

                    avgXDiffs[i].forEach((elem) => {
                        xSum += elem;
                    })

                    avgYDiffs[i].forEach((elem) => {
                        ySum += elem;
                    })

                    console.log('For box:', i);
                    console.log('avg X', xSum / avgXDiffs[i].length);
                    console.log('avg Y', ySum / avgYDiffs[i].length);
                    console.log('Times: ', avgYDiffs[i].length);
                    console.log('_________________________');
                }

            }
        }


        // if (calibrateObj.calibrationSet) {
        //     let xDiff = ((centerX - eyePos[0]) / centerX) * 1000;
        //     let yDiff = ((centerY - eyePos[1]) / centerY) * 1000;


        //     xDiffAvg.push(xDiff);
        //     xDiffAvg.shift();
        //     xDiff = xDiffAvg[0] + xDiffAvg[1] + xDiffAvg[2];

        //     yDiffAvg.push(yDiff);
        //     yDiffAvg.shift();
        //     yDiff = yDiffAvg[0] + yDiffAvg[1] + yDiffAvg[2];


        //     if(count % 50 === 0) {
        //     	console.log('diff', xDiff, yDiff);
        //     }

        //     if (xDiff < zeroXNeg && yDiff > zeroYPos) {
        //         calibrateObj.selectedBox = 0;
        //     } else if (xDiff > zeroXPos && yDiff > zeroYPos) {
        //         calibrateObj.selectedBox = 1;
        //     } else if (xDiff < zeroXNeg && yDiff < zeroYNeg) {
        //         calibrateObj.selectedBox = 3;
        //     } else if (xDiff > zeroXPos && yDiff < zeroYNeg) {
        //         calibrateObj.selectedBox = 4;
        //     } else {
        //         calibrateObj.selectedBox = 2;
        //     }

        // }
    }




    let getEyeValues = () => {
        let positions = TrackingFactory.getPositions();
        if (positions) {
            eyePos = PositionFactory.getPupilValues(positions);
            calibrateValues();
        }
        // if (!calibrateObj.calibrationSet) {
        //     frameId = requestAnimationFrame(getEyeValues);
        // }

        frameId = requestAnimationFrame(getEyeValues);

    }


    calibrateObj.runCalibration = () => {
        requestAnimationFrame(getEyeValues)
        setTimeout(() => {
            changeBox()
        }, 500);
    }


    return calibrateObj;
});



// let findDiff = (box) => {
//        let xDiff = ((calibrationArray[2][0] - calibrationArray[box][0]) / calibrationArray[2][0]) * 1000;
//        let yDiff = ((calibrationArray[2][1] - calibrationArray[box][1]) / calibrationArray[2][1]) * 1000;
//        return [xDiff, yDiff];
//    }

//    let setZeros = () => {
//        console.log('top left', findDiff(0));

//        zeroXNeg = ((findDiff(0)[0] + findDiff(3)[0]) / 2) * .2;
//        zeroYPos = ((findDiff(0)[1] + findDiff(1)[1]) / 2) * .2;
//        zeroYNeg = ((findDiff(3)[1] + findDiff(4)[1]) / 2) * .2;
//        zeroXPos = ((findDiff(2)[0] + findDiff(4)[0]) / 2) * .2;

//        centerX = calibrationArray[2][0];
//        centerY = calibrationArray[2][1];

//        console.log('-x', zeroXNeg);
//        console.log('-y', zeroYNeg);
//        console.log('y', zeroYPos);
//        console.log('x', zeroXPos);
//        console.log('center', centerX, centerY);



//        console.log('top right', findDiff(1));


//        console.log('bottom left', findDiff(3));

//        console.log('bottom right', findDiff(4));
//    }