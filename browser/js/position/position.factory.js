// Analysis of tracker positions
core.factory('PositionFactory', function() {
    let browThreshold = 15;
    let eyeThreshold = 40;
    let browZero = [];
    let rightZeroArray = [];
    let leftZeroArray = [];
    const browArray = [20, 21, 17, 16];
    const rightEyeArray = [63, 24, 64, 20, 21];
    const leftEyeArray = [67, 29, 68, 17, 16];
    // let maxArray = [];

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
            let change = 0;
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
        setBlinkZero: (positions) => {
            leftZeroArray = leftEyeArray.map(function(index) {
                return positions[index][1]
            });
            rightZeroArray = rightEyeArray.map(function(index) {
                return positions[index][1]
            });
        }
    }
});
