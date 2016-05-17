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
    let pupilZeroArray = [0,0];
    let xDiffAvg = [0,0,0,0];
    let yDiffAvg = [0,0,0,0];
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

    function findAverage(arr){
        let sum = 0;
        arr.forEach((n) =>{
            sum+=n
        })
        return sum/arr.length
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

            if(positions[57][1] - positions[60][1] > 8) { //checks mouth positions
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
        },
        setPupilZero: (positions) => { // called from iterate factory, locks in our pupil average

            // pupilCount = 0;
            // pupilArray.forEach(function(elem, index) {
            //     pupilZeroArray[0] += positions[elem][0] //adds the x position
            //     pupilZeroArray[1] += positions[elem][1] //adds the y position
            // });
            function smallestToLargest(a, b) {
              return a - b;
            }
            // set the zero to the average of the zeroing arrays, with the extremes removed to account for eye "wobble"
            eyeXZero = findAverage(xZeroArray.sort(smallestToLargest).slice(2,-2));
            eyeYZero = findAverage(yZeroArray.sort(smallestToLargest).slice(2,-2));
            console.log("eye zeros", eyeXZero, eyeYZero)
        },
        getPupilAverage: (positions) => { // called from iterate factory, attempts to establish a pupil average
            xZeroArray.push(positions[27][0]+positions[32][0])
            yZeroArray.push(positions[27][1]+positions[32][1])
            // pupilCount++;
            // pupilArray.forEach(function(elem, index) {
            //     pupilAverage[0] += positions[elem][0] //adds the x position
            //     pupilAverage[1] += positions[elem][1] //adds the y position
            // });
            console.log("averaging", xZeroArray, yZeroArray)
        },
        changePattern: () => {
            useXPattern = !useXPattern; // allows us to switch between xPattern and plusPattern
            return useXPattern;
        },
        getPattern: () => {
            return useXPattern;
        },
        pupilPosition: (positions) => {
            eyeX = positions[27][0]+positions[32][0];
            eyeY = positions[27][1]+positions[32][1];
            let box = 2; //defaults the selected box to
            // pupilArray.forEach(function(elem, index) { // pushes left and right eye to the tracking array
            //     eyeX += positions[elem][0] //adds the x position
            //     eyeY += positions[elem][1] //adds the y position
            // });
            xDiffAvg.push(eyeX);
            xDiffAvg.shift();
            // xDiff = xDiffAvg[0] + xDiffAvg[1] + xDiffAvg[2];
            yDiffAvg.push(eyeY);
            yDiffAvg.shift();
            // yDiff = yDiffAvg[0] + yDiffAvg[1] + yDiffAvg[2];
            // let xDiff = eyeXZero - findAverage(xDiffAvg)
            // let yDiff = eyeYZero - findAverage(yDiffAvg)
            let xDiff = ((eyeXZero - findAverage(xDiffAvg))/eyeXZero)*100
            let yDiff = ((eyeYZero - findAverage(yDiffAvg))/eyeYZero)*100
            let xDiffAbs = Math.abs(xDiff);
            let yDiffAbs = Math.abs(yDiff);

            console.log("diff percent,", xDiffAbs, yDiffAbs)
            // let xDiff = eyeXZero - eyeX;
            // let yDiff = eyeYZero - eyeY;

            // if(Math.abs(xDiff) + Math.abs(yDiff) > 100) {
            //     pupilCount++;
            //     console.log('not stable');
            //     if(pupilCount > 5) {
            //         pupilCount = 0;
            //         return false;
            //     }
            // }
            if (useXPattern){
                if (xDiff < -pupilThreshold && yDiff > pupilThreshold) { // LEFT TOP
                    box = 0;
                } else if (xDiff > pupilThreshold && yDiff > pupilThreshold) { // RIGHT TOP
                    box = 1;
                } else if (xDiff < -pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM RIGHT
                    box = 3;
                } else if (xDiff > pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM LEFT
                    box = 4;
                }
            } else {
                if (xDiff > yDiff && xDiff < pupilThreshold) { // LEFT
                    // console.log("left", xDiff, yDiff)
                    box = 5;
                } else if (xDiff > yDiff && xDiff > pupilThreshold) { // RIGHT
                    // console.log("Right", xDiff, yDiff)
                    box = 6;
                } else if (xDiff < yDiff && yDiff > pupilThreshold) { // TOP
                    // console.log("Top", xDiff, yDiff)
                    box = 8;
                } else if (xDiff < yDiff && yDiff < pupilThreshold) { // BOTTOM
                    // console.log("bottom", xDiff, yDiff)
                    box = 9;
                }
            }


            // let xDiff = (positions[33][0] - positions[32][0]) - eyeXZero;

            // let yDiff = (positions[33][1] - positions[32][1]) - eyeYZero;

            // xDiff = -xDiff;

            // if (xDiff < -pupilThreshold && yDiff > pupilThreshold) { // LEFT TOP
            //     console.log('eye diff LT', [xDiff, yDiff]);
            //     xPattern = 0;
            // } else if (xDiff > pupilThreshold && yDiff > pupilThreshold) { // RIGHT TOP
            //     console.log('eye diff RT', [xDiff, yDiff]);
            //     xPattern = 1;
            // } else if (xDiff < -pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM RIGHT
            //     console.log('eye diff BR', [xDiff, yDiff]);
            //     xPattern = 3;
            // } else if (xDiff > pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM LEFT
            //     console.log('eye diff Bl', [xDiff, yDiff]);
            //     xPattern = 4;
            // }

            // let xDiff = pupilArry[0] - eyeX;
            // let yDiff = pupilZeroArray[1] - eyeY;
            // pupilCount++;
            // if(pupilCount > 10) {
            //     console.log("Diff", [xDiff.toFixed(1), yDiff.toFixed(1)]);
            //     pupilCount = 0;

            // }

            console.log(box)
            return box //(useXPattern) ? xPattern : plusPattern;
        }
    }
});



















