core.factory("KeyboardFactory", function($rootScope) {
    const alphabet = [
        ["A", "B", "C", "D", "E", "Yes"],
        ["F", "G", "H", "I", "J", "No"],
        ["K", "L", "M", "N", "O", "*"],
        ["P", "Q", "R", "S", "T", "/"],
        ["U", "V", "W", "X", "Y", "Z"],
        ["0", "1", "2", "3", "4", "+"],
        ["5", "6", "7", "8", "9", "-"]
    ];
    let coords = [0, 0]; //Current spot in alphabet array
    const current = ['A'];
    const word = [];
    let run = true;

    // Iterates through letters
    const iterator = () => {
            // $scope.current = $scope.alphabet[coords[0]][coords[1]];
            if (coords[1] < 5) { coords[1]++ } else if (coords[0] === 6) { coords = [0, 0] } else {
                coords[0]++;
                coords[1] = 0;
            }
            //Cache new current letter
            angular.copy([alphabet[coords[0]][coords[1]]], current);
            $rootScope.$digest();
        };

    // Iterator is run on intervals
    let cycle;
    const loop = (time) => {
        cycle = setInterval(iterator, time);
    };

    return {
        // Loop through the array, highlighting each letter
        loop: loop,
        // Returns current letter
        selectLetter: () => {
            clearInterval(cycle);
            run=false
            word.push([alphabet[coords[0]][coords[1]]])
            setTimeout(() => {
                loop(500);
                run = true;
            }, 1000);
            return current[0];
        },
        alphabet: alphabet,
        getCurrentLetter: () => {
            return current;
        },
        getCurrentWord: () => {
            return word;
        },
        run: () => {
            return run;
        },
        endTracking: () => {
            run = false;
            clearInterval(cycle);
        }
    }
});
