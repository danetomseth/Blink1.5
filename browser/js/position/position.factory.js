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
    let xZeroArray = [];
    let yZeroArray = [];
    let mouthZero = 0;
    let pupilZeroArray = [0, 0];
    let xDiffAvg = [];
    let yDiffAvg = [];
    let eyeZero = 500;
    let eyeX = 0;
    let eyeY = 0;
    const pupilThreshold = 0;
    const browArray = [20, 21, 17, 16];
    const eyeArray = [63, 24, 64, 20, 21, 67, 29, 68, 17, 16];
    const rightEyeArray = [63, 24, 64, 20, 21];
    const leftEyeArray = [67, 29, 68, 17, 16];
    const pupilArray = [27, 32]; // possibly deprecated
    let maxArray = [];
    let averageReading = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let readingCount = 0;
    let pupilCount = 0;
    let pupilAverage = [0, 0];
    let eyeXZero = 0;
    let eyeYZero = 0;
    let useXPattern = true;

    let XPattern = {
        left: {
            top: 0,
            bottom: 2
        },
        right: {
            top: 1,
            bottom: 3
        }
    }

    let PPattern = {
        top: 8,
        bottom: 9,
        left: 5,
        right: 6
    }

    function findAverage(arr) {
        let sum = 0;
        arr.forEach((n) => {
            sum += n
        })
        return sum / arr.length
    }

    Array.prototype.pushFixedLength = function(val, len) {
        this.push(val);
        while (this.length > len) {
            this.shift();
        }
    }

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

            if (positions[57][1] - positions[60][1] > 8) { //checks mouth positions
                return 'delete';
            }
            return ((diffZero - diff) > 1.7); //compares current distance of eyelid to zero distance
        },
        setBlinkZero: () => {
            diffZero = diffZero / readingCount; //sets the average distance between top eyelid and bottom
            readingCount = 0;
        },
        getBlinkAverage: (positions) => {
            readingCount++;
            mouthZero = positions[57][1] - positions[60][1];
            diffZero += (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
        },
        setEyeZero: (positions) => {
            leftZeroArray = leftEyeArray.map(function(index) {
                return positions[index][1];
            });
            rightZeroArray = rightEyeArray.map(function(index) {
                return positions[index][1];
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
        },
        setPupilZero: (positions) => { // called from iterate factory, locks in our pupil average
            function smallestToLargest(a, b) {
                return a - b;
            }
            // set the zero to the average of the zeroing arrays, with the extremes removed to account for eye "wobble"
            eyeXZero = findAverage(xZeroArray.sort(smallestToLargest).slice(2, -2));
            eyeYZero = findAverage(yZeroArray.sort(smallestToLargest).slice(2, -2));
        },
        getPupilAverage: (positions) => { // called from iterate factory, attempts to establish a pupil average
            xZeroArray.push((positions[27][0] + positions[32][0]) / 2);
            yZeroArray.push((positions[27][1] + positions[32][1]) / 2);
        },
        changePattern: () => {
            useXPattern = !useXPattern; // allows us to switch between xPattern and plusPattern
            return useXPattern;
        },
        getPattern: () => {
            return useXPattern;
        },
        pupilPosition: (positions) => {
            eyeX = (positions[27][0] + positions[32][0]) / 2; // Adds average x positions of both eyes
            eyeY = (positions[27][1] + positions[32][1]) / 2; // Adds average y positions of both eyes
            // let box = 2; //defaults the selected box to middle

            // Push to average array, keep length at 5
            xDiffAvg.pushFixedLength(eyeX, 5);
            yDiffAvg.pushFixedLength(eyeY, 5);

            // Percent changes for x/y pupil movement
            let xDiff = ((eyeXZero - findAverage(xDiffAvg)) / eyeXZero) * 100;
            let yDiff = ((eyeYZero - findAverage(yDiffAvg)) / eyeYZero) * 100;

            if (useXPattern) {
                if (xDiff < -pupilThreshold) {
                    if (yDiff > pupilThreshold) {
                        return XPattern["left"]["top"];
                    } else return XPattern["left"]["bottom"];
                } else if (xDiff > pupilThreshold) {
                    if (yDiff > pupilThreshold) {
                        return XPattern["right"]["top"];
                    } else return XPattern["right"]["bottom"];
                }
            } else {
                if (xDiff < -pupilThreshold) { // LEFT
                    return PPattern["left"];
                } else if (xDiff > pupilThreshold) { // RIGHT
                    return PPattern["right"];
                } else if (yDiff > pupilThreshold) { // TOP
                    return PPattern["top"];
                } else if (yDiff < pupilThreshold) { // BOTTOM
                    return PPattern["bottom"];
                }
            }
        }
    }
});
