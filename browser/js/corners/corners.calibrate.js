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


        calibrateObj.selectedBox = 0;
        calibrateObj.calibrationSet = false;

        calibrateObj.calBoxes = ['X', '', '', '', ''];

        let boxInt;


        let findDiff = (box) => {
            let xDiff = calibrationArray[box][0] / calibrationArray[box][0].length;
            let yDiff = calibrationArray[box][1] / calibrationArray[box][1].length;;
            return [xDiff, yDiff];
        }

        let setZeros = () => {
            console.log('top left', findDiff(0));

            zeroXNeg = ((findDiff(0)[0] + findDiff(3)[0]) / 2);
            zeroYPos = ((findDiff(0)[1] + findDiff(1)[1]) / 2);
            zeroYNeg = ((findDiff(3)[1] + findDiff(4)[1]) / 2);
            zeroXPos = ((findDiff(2)[0] + findDiff(4)[0]) / 2);

            centerX = calibrationArray[2][0];
            centerY = calibrationArray[2][1];

            console.log('-x', zeroXNeg);
            console.log('-y', zeroYNeg);
            console.log('y', zeroYPos);
            console.log('x', zeroXPos);
            console.log('center', centerX, centerY);



            console.log('top right', findDiff(1));


            console.log('bottom left', findDiff(3));

            console.log('bottom right', findDiff(4));
        }



        let readDelay = () => {
            readyToRead = false;
            setTimeout(() => {
                readyToRead = true;
                readCount = 0;
                eyeXSum = 0;
                eyeYSum = 0;
            }, 1000);
        }

        let setCalibrationValue = () => {
            let avgVal = [(eyeXSum / readCount).toFixed(3), (eyeYSum / readCount).toFixed(3)];
            calibrationArray.push(avgVal);
            console.log('Cal array', calibrationArray);
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
                    calibrateObj.calibrationSet = true;
                    $interval.cancel(boxInt);
                    setZeros()
                }
            }, 2000);
        }

        let calibrateValues = () => {
            if (readyToRead) {
                readCount++
                eyeXSum += eyePos[0];
                eyeYSum += eyePos[1];
            }

            if (calibrateObj.calibrationSet) {
	            let xDiff = centerX - eyePosX;
	            let yDiff = centerY - eyePosY;
	            xDiffAvg.push(xDiff);
	            xDiffAvg.shift();
	            xDiff = xDiffAvg[0] + xDiffAvg[1] + xDiffAvg[2];

	            yDiffAvg.push(yDiff);
	            yDiffAvg.shift();
	            yDiff = yDiffAvg[0] + yDiffAvg[1] + yDiffAvg[2];

	            if (xDiff < -pupilThreshold && yDiff > pupilThreshold) { // LEFT TOP
	                calibrateObj.selectedBox = 0;
	            } else if (xDiff > pupilThreshold && yDiff > pupilThreshold) { // RIGHT TOP
	                calibrateObj.selectedBox = 1;
	            } else if (xDiff < -pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM RIGHT
	                calibrateObj.selectedBox = 3;
	            } else if (xDiff > pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM LEFT
	                calibrateObj.selectedBox = 4;
	            } else calibrateObj.selectedBox = 2;
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