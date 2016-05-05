// Basic iteration and letter select/get

core.factory("KeyboardFactory", function() {
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
    //let word = [];
    let word = "";
    return {
        iterator: () => {
            // Moves to next letter
            if(!coords) {
                coords = [0,0];
            }
            else if (coords[1] < 5) {
                coords[1]++;
            }
            else if (coords[0] === 6) { coords = [0, 0] } else {
                coords[0]++;
                coords[1] = 0;
            }
            // Returns current letter
            return alphabet[coords[0]][coords[1]];
        },
        selectLetter: () => {
            //word.push(alphabet[coords[0]][coords[1]])
            word += alphabet[coords[0]][coords[1]]
            return word;
        },
        resetPosition: () => {
            coords = [6,5];
        },
        alphabet: alphabet,
        getCurrentWord: () => {
            return word;
        }
    }
});
