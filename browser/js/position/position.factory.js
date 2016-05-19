// Analysis of tracker positions
core.factory('PositionFactory', function(ConstantsFactory) {
    let browThreshold = 15;
    let eyeThreshold = 40;
    let blinkThreshold = 3;
    let mouthThreshold = 12;
    let diffZero = 0;
    let diffZeroL = 0;
    let diffZeroR = 0;
    let browZero = [];
    let rightZeroArray = [];
    let leftZeroArray = [];
    let eyeZeroArray = [];
    let mouthZero = 0;
    let pupilZeroArray = [0,0];
    let xDiffAvg = [0,0,0];
    let yDiffAvg = [0,0,0];
    let eyeZero = 500;
    let eyeX = 0;
    let eyeY = 0;
    const pupilThreshold = 0.1;
    // const pupilXThreshold = 0;
    // const pupilYThreshold = 0.1;

    const browArray = [20, 21, 17, 16];
    const eyeArray = [63, 24, 64, 20, 21, 67, 29, 68, 17, 16];
    const rightEyeArray = [63, 24, 64, 20, 21];
    const leftEyeArray = [67, 29, 68, 17, 16];
    const pupilArray = [27, 32];
    let maxArray = [0.9];
    let averageReading = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let readingCount = 0;
    let pupilCount = 0;
    let pupilAverage = [0, 0];
    let eyeXZero = 0;
    let eyeYZero = 0;
    let lastBlinkTime;

    return {
        // Indicate if movement is above threshold
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
        // Initialize base brow positions
        setBrowZero: (positions) => {
            browZero = browArray.map(function(index) {
                return positions[index][1];
            });
        },
        // Setting custom thresholds for User
        setThreshold: (threshold) => {
            browThreshold = threshold;
        },
        blinkCompare: (positions) => {
            let eyeTotal = 0;
            let change = 0
            var diffL = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            var diffR = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            change = ((diffL + diffR) / ConstantsFactory.blinkZero);
            if (change < ConstantsFactory.blinkRatio) {
                let blinkDt = Date.now() - lastBlinkTime;
                lastBlinkTime = Date.now();
                return ((blinkDt <= 750) && (blinkDt > 250)) ? "doubleBlink" : "singleBlink"
            } else {
                return false;
            }
        },
        setBlinkZero: () => {
            diffZero = (diffZeroL / readingCount) + (diffZeroR / readingCount); //sets the average distance between top eyelid and bottom
            readingCount = 0;
            diffZeroL = 0;
            diffZeroR = 0;
            return diffZero;
        },
        getBlinkAverage: (positions) => {
            readingCount++;
            mouthZero = positions[57][1] - positions[60][1];
            diffZeroL += (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            diffZeroR += (positions[66][1] + positions[26][1] + positions[65][1]) - (positions[63][1] + positions[24][1] + positions[64][1]);
        },
        setEyeZero: (positions) => {
            leftZeroArray = leftEyeArray.map(function(index) {
                return positions[index][1]
            });
            rightZeroArray = rightEyeArray.map(function(index) {
                return positions[index][1]
            });
        },
        getBlinkValue: (positions) => {
            diffZeroL = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            diffZeroR = (positions[66][1] + positions[26][1] + positions[65][1]) - (positions[63][1] + positions[24][1] + positions[64][1]);
            return [diffZeroL, diffZeroR];
        },
        eyeCompare: (positions) => {
            let eyeTotal = 0;
            let change = 0
                //This compares individual eyes
            leftEyeArray.forEach(function(point, i) {
                change = Math.abs(((positions[point][1] - leftZeroArray[i]) / leftZeroArray[i]) * 100)
                eyeTotal += change;
            });
            rightEyeArray.forEach(function(point, i) {
                change = Math.abs(((positions[point][1] - rightZeroArray[i]) / rightZeroArray[i]) * 100)
                eyeTotal += change;
            });
            return (eyeTotal > eyeThreshold);
        },
        setPupilZero: (positions) => {
            pupilCount = 0;
            pupilArray.forEach(function(elem, index) {
                pupilZeroArray[0] += positions[elem][0] //adds the x position
                pupilZeroArray[1] += positions[elem][1] //adds the y position
            });

            eyeXZero = positions[33][0] - positions[32][0];
            eyeYZero = positions[33][1] - positions[32][1];
        },
        getPupilAverage: (positions) => {
            pupilCount++;
            pupilArray.forEach(function(elem, index) {
                pupilAverage[0] += positions[elem][0] //adds the x position
                pupilAverage[1] += positions[elem][1] //adds the y position
            });
        },
        pupilPosition: (positions) => {
            eyeX = 0;
            eyeY = 0;
            pupilArray.forEach(function(elem, index) {
                eyeX += positions[elem][0] //adds the x position
                eyeY += positions[elem][1] //adds the y position
            });

            let xDiff = pupilZeroArray[0] - eyeX;
            let yDiff = pupilZeroArray[1] - eyeY;
            xDiffAvg.push(xDiff);
            xDiffAvg.shift();
            xDiff = xDiffAvg[0] + xDiffAvg[1] + xDiffAvg[2];

            yDiffAvg.push(yDiff);
            yDiffAvg.shift();
            yDiff = yDiffAvg[0] + yDiffAvg[1] + yDiffAvg[2];

            if (xDiff < -pupilThreshold && yDiff > pupilThreshold) { // LEFT TOP
                return 0;
            } else if (xDiff > pupilThreshold && yDiff > pupilThreshold) { // RIGHT TOP
                return 1;
            } else if (xDiff < -pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM RIGHT
                return 3;
            } else if (xDiff > pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM LEFT
                return 4;
            }
            else return 2;

            // let xDiff = (positions[33][0] - positions[32][0]) - eyeXZero;

            // let yDiff = (positions[33][1] - positions[32][1]) - eyeYZero;

            // xDiff = -xDiff;

            // if (xDiff < -pupilThreshold && yDiff > pupilThreshold) { // LEFT TOP
            //     console.log('eye diff LT', [xDiff, yDiff]);
            //     returnBox = 0;
            // } else if (xDiff > pupilThreshold && yDiff > pupilThreshold) { // RIGHT TOP
            //     console.log('eye diff RT', [xDiff, yDiff]);
            //     returnBox = 1;
            // } else if (xDiff < -pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM RIGHT
            //     console.log('eye diff BR', [xDiff, yDiff]);
            //     returnBox = 3;
            // } else if (xDiff > pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM LEFT
            //     console.log('eye diff Bl', [xDiff, yDiff]);
            //     returnBox = 4;
            // }

            // let xDiff = pupilArry[0] - eyeX;
            // let yDiff = pupilZeroArray[1] - eyeY;
            // pupilCount++;
            // if(pupilCount > 10) {
            //     console.log("Diff", [xDiff.toFixed(1), yDiff.toFixed(1)]);
            //     pupilCount = 0;

            // }
            // return returnBox;
        }
    }
});
