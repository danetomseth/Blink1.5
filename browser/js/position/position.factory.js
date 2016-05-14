// Analysis of tracker positions
core.factory('PositionFactory', function() {
    let browThreshold = 15;
    let eyeThreshold = 40;
    let blinkThreshold = 3;
    let browZero = [];
    let rightZeroArray = [];
    let leftZeroArray = [];
    let eyeZeroArray = [];
    let pupilZeroArray = [];
    let eyeZero = 500;
    let eyeX = 0;
    let eyeY = 0;
    const pupilThreshold = 1;
    const browArray = [20, 21, 17, 16];
    const eyeArray = [63, 24, 64, 20, 21, 67, 29, 68, 17, 16];
    const rightEyeArray = [63, 24, 64, 20, 21];
    const leftEyeArray = [67, 29, 68, 17, 16];
    const pupilArray = [27, 32]; 
    let maxArray = [];
    let averageReading = [0,0,0,0,0,0,0,0,0,0];
    let readingCount = 0;
    let pupilCount = 0;
    let pupilAverage = [0,0];

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

            eyeArray.forEach(function(point, i) {
                change = Math.abs(((positions[point][1] - eyeZeroArray[i]) / eyeZeroArray[i]) * 100)
                eyeTotal += change;
            });
            readingCount++

            return (change > blinkThreshold);


        },
        setBlinkZero: () => {
           averageReading.forEach(function(elem, index) {
                eyeZeroArray[index] = (elem / readingCount); 
            });
           averageReading = [];
           readingCount = 0;
        },
        getBlinkAverage: (positions) => {
            readingCount++;
            eyeArray.forEach(function(elem, index) {
                averageReading[index] += positions[elem][1]
            });
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
        setPupilZero: () => {
            pupilAverage.forEach(function(elem, index) {
                pupilZeroArray[index] = (elem / pupilCount); 
            });
           pupilAverage = [];
           pupilCount = 0;
        },
        getPupilAverage: (positions) => {
            pupilCount++;
            pupilArray.forEach(function(elem, index) {
                pupilAverage[0] += positions[elem][0] //adds the x position
                pupilAverage[1] += positions[elem][1] //adds the x position
            });
        },
        pupilPosition: (positions) => {
            eyeX = 0;
            eyeY = 0;
            let returnBox = 4;
            pupilArray.forEach(function(elem, index) {
                eyeX += positions[elem][0] //adds the x position
                eyeY += positions[elem][1] //adds the x position
            });
            let xDiff = pupilZeroArray[0] - eyeX;
            let yDiff = pupilZeroArray[1] - eyeY;
            if (xDiff < -pupilThreshold && yDiff > pupilThreshold) { // LEFT TOP
                returnBox = 0;
            } else if (xDiff > pupilThreshold && yDiff > pupilThreshold) { // RIGHT TOP
                returnBox = 2;
            } else if (xDiff > pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM RIGHT
                returnBox = 8;
            } else if (xDiff < -pupilThreshold && yDiff < -pupilThreshold) { // BOTTOM LEFT
                returnBox = 6;
            }
            return returnBox;
        }
    }
});


















