// Analysis of tracker positions
core.factory('PositionFactory', function() {
    let browThreshold = 15;
    let eyeThreshold = 40;
    let blinkThreshold = 3;
    let mouthThreshold = 12;
    let diffZero = 0;
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
    const pupilThreshold = 0;
    const browArray = [20, 21, 17, 16];
    const eyeArray = [63, 24, 64, 20, 21, 67, 29, 68, 17, 16];
    const rightEyeArray = [63, 24, 64, 20, 21];
    const leftEyeArray = [67, 29, 68, 17, 16];
    const pupilArray = [27, 32];
    let maxArray = [];
    let averageReading = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let readingCount = 0;
    let pupilCount = 0;
    let pupilAverage = [0, 0];
    let eyeXZero = 0;
    let eyeYZero = 0;

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
            var diff = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);

            // if(positions[57][1] - positions[60][1] > 8) { //checks mouth positions
            //     return 'delete';
            // }

            return ((diffZero - diff) > 2.2); //compares current distance of eyelid to zero distance
        },
        setBlinkZero: () => {
            console.log("SetBlinkZero", diffZero, readingCount)
            diffZero = diffZero / readingCount; //sets the average distance between top eyelid and bottom
            readingCount = 0;
        },
        getBlinkAverage: (positions) => {
            readingCount++;
            console.log("ReadingCount", readingCount)
            mouthZero = positions[57][1] - positions[60][1];
            diffZero += (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
        },
        setEyeZero: (positions) => {
            leftZeroArray = leftEyeArray.map(function(index) {
                return positions[index][1]
            });
            rightZeroArray = rightEyeArray.map(function(index) {
                return positions[index][1]
            });
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
            console.log('Zero:', [eyeXZero, eyeYZero]);
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
            let returnBox = 2;; //defaults to center
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

            if(Math.abs(xDiff) + Math.abs(yDiff) > 100) {
                pupilCount++;
                console.log('not stable');
                if(pupilCount > 5) {
                    pupilCount = 0;
                    return false;
                }
            }
            if (xDiff < -pupilThreshold && yDiff > pupilThreshold) { // LEFT TOP
                returnBox = 0;
            } else if (xDiff > pupilThreshold && yDiff > pupilThreshold) { // RIGHT TOP
                returnBox = 1;
            } else if (xDiff < -pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM RIGHT
                returnBox = 3;
            } else if (xDiff > pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM LEFT
                returnBox = 4;
            }
            // return returnBox;
            return returnBox;
        }
    }
});
