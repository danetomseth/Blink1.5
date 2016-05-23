// Analysis of tracker positions
core.factory('PositionFactory', function(ConstantsFactory) {
    let browThreshold = 15;
    let diffZeroL = 0;
    let diffZeroR = 0;
    let browZero = [];
    let pupilZeroArray = [0, 0];
    let xDiffAvg = [0, 0, 0];
    let yDiffAvg = [0, 0, 0];
    let xDiff = 0;
    let yDiff = 0;
    let eyeX = 0;
    let eyeY = 0;
    let eyePos = [0, 0];
    let currentBox = 0;
    let lastBox = 0;
    const pupilThreshold = 0.1;
    const browArray = [20, 21, 17, 16];
    const pupilArray = [27, 32];
    let lastBlinkTime;
    let debounce = true;

    let blinkDelay = () => {
        setTimeout(function() {
            debounce = true;
        }, 500);
    }

    return {
        // Indicate if movement is above threshold: POSSIBLY DEPRICATED
        browCompare: (positions) => {
            let browTotal = 0;
            let change = 0;
            browArray.forEach(function(point, i) {
                // Sums percent changes of brow y-coordinates
                change = Math.abs(((positions[point][1] - browZero[i]) / browZero[i]) * 100)
                browTotal += change;
            });
            return (browTotal > browThreshold);
        },
        // Initialize base brow positions POSSIBLY DEPRECATED
        setBrowZero: (positions) => {
            browZero = browArray.map(function(index) {
                return positions[index][1];
            });
        },
        blinkCompare: (positions) => { // only used in TimerFactory - which is used everywhere
            let change = 0
            var diffL = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            var diffR = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            console.log((diffL + diffR));
            change = ((diffL + diffR) / ConstantsFactory.blinkZero);

            // if (change < ConstantsFactory.blinkRatio) {
            //     if (debounce) {
            //         debounce = false;
            //         blinkDelay();
            //         return "singleBlink";
            //     }
            // } else return false

            if (change < ConstantsFactory.blinkRatio) {
                let blinkDt = Date.now() - lastBlinkTime;
                lastBlinkTime = Date.now();
                

                if (blinkDt < 125) {
                    return false
                } else {
                    if (blinkDt <= 320) {
                        return 'doubleBlink';
                    } else {
                        return 'singleBlink'
                    }
                }
            }
            // if (change < ConstantsFactory.blinkRatio) {
            //     let blinkDt = Date.now() - lastBlinkTime;
            //     lastBlinkTime = Date.now();
            //     if(blinkDt < 250) {return false} // debounce
            //     return (blinkDt <= 750) ? "doubleBlink" : "singleBlink"
            // } else {
            //     return false;
            // }
        },
        getBlinkValue: (positions) => { // used in calibrate.js only
            diffZeroL = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            diffZeroR = (positions[66][1] + positions[26][1] + positions[65][1]) - (positions[63][1] + positions[24][1] + positions[64][1]);
            return diffZeroL + diffZeroR;
        },
        setPupilZero: (positions) => { // used only in corners controller
            pupilArray.forEach(function(elem) {
                pupilZeroArray[0] += positions[elem][0] //adds the x position
                pupilZeroArray[1] += positions[elem][1] //adds the y position
            });
        },
        getPupilValues: (positions) => {
            let eyeXVal = 0;
            let eyeYVal = 0;
            pupilArray.forEach(function(elem, index) {
                eyeXVal += positions[elem][0] //adds the x position
                eyeYVal += positions[elem][1] //adds the y position
            });
            return [eyeXVal, eyeYVal];
        },
        pupilPosition: (positions) => {
            if (!ConstantsFactory.pupilsCalibrated) {
                return null
            }
            let eyeXVal = 0;
            let eyeYVal = 0;
            pupilArray.forEach(function(elem, index) {
                eyeXVal += positions[elem][0] //adds the x position
                eyeYVal += positions[elem][1] //adds the y position
            });
            eyePos = [eyeXVal, eyeYVal];
            xDiff = ConstantsFactory.center[0] - eyePos[0];
            yDiff = ConstantsFactory.center[1] - eyePos[1];

            xDiffAvg.push(xDiff);
            xDiffAvg.shift();
            xDiff = (xDiffAvg[0] + xDiffAvg[1] + xDiffAvg[2]) / 3;

            yDiffAvg.push(yDiff);
            yDiffAvg.shift();
            yDiff = (yDiffAvg[0] + yDiffAvg[1] + yDiffAvg[2]) / 3;

            if (xDiff < ConstantsFactory.xThresh[0] && yDiff > ConstantsFactory.yThresh[1]) { // LEFT TOP
                currentBox = 0;
            } else if (xDiff > ConstantsFactory.xThresh[1] && yDiff > ConstantsFactory.yThresh[1]) { // RIGHT TOP
                currentBox = 1;
            } else if (xDiff < ConstantsFactory.xThresh[0] && yDiff < ConstantsFactory.yThresh[0]) { // BOTTOM RIGHT
                currentBox = 3;
            } else if (xDiff > ConstantsFactory.xThresh[1] && yDiff < ConstantsFactory.yThresh[0]) { // BOTTOM LEFT
                currentBox = 4;
            } else {
                currentBox = 2;

            }

            if (lastBox === currentBox) {
                return currentBox;
            } else if ((Math.abs(xDiff) / ConstantsFactory.xThresh[1]) > 1.5) {
                return currentBox
            } else {
                lastBox = currentBox;
            }

            return currentBox;

            // eyeX = 0;
            // eyeY = 0;
            // pupilArray.forEach(function(elem) {
            //     eyeX += positions[elem][0] //adds the x position
            //     eyeY += positions[elem][1] //adds the y position
            // });

            // let xDiff = pupilZeroArray[0] - eyeX;
            // let yDiff = pupilZeroArray[1] - eyeY;
            // xDiffAvg.push(xDiff);
            // xDiffAvg.shift();
            // xDiff = xDiffAvg[0] + xDiffAvg[1] + xDiffAvg[2];

            // yDiffAvg.push(yDiff);
            // yDiffAvg.shift();
            // yDiff = yDiffAvg[0] + yDiffAvg[1] + yDiffAvg[2];

            // if (xDiff < -pupilThreshold && yDiff > pupilThreshold) { // LEFT TOP
            //     return 0;
            // } else if (xDiff > pupilThreshold && yDiff > pupilThreshold) { // RIGHT TOP
            //     return 1;
            // } else if (xDiff < -pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM RIGHT
            //     return 3;
            // } else if (xDiff > pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM LEFT
            //     return 4;
            // }
            // else return 2;
        }
    }
});