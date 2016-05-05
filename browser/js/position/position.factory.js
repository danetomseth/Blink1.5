core.factory('PositionFactory', function() {
    let browThreshold = 20;
    let browZero = [];
    const browArray = [20, 21, 17, 16];
    return {
        browCompare: (positions) => {
            let browTotal = 0;
            let change = 0;
            browArray.forEach(function(point, i) {
                change = Math.abs(((positions[point][1] - browZero[i]) / browZero[i]) * 100)
                browTotal += change;
            });
            return (browTotal > browThreshold)
        },
        setBrowZero: (positions) => {
            browZero = browArray.map(function(index) {
                return positions[index][1]
            });
        },
        setThreshold: (threshold) => {
            browThreshold = threshold;
        }
    }
});