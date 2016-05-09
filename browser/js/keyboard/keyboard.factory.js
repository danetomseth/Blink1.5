// Basic iteration and letter select/get

core.factory("KeyboardFactory", function($state) {
    let rowIndex = 0;
    let letterIndex = 0;
    let startRow = true;
    const alphabet = [
        ["A", "B", "C", "D", "E"],
        ["F", "G", "H", "I", "J"],
        ["K", "L", "M", "N", "O"],
        ["P", "Q", "R", "S", "T"],
        ["U", "V", "W", "X", "Y"],
        ['space', 'YES', 'NO', 'faces', 'NAV']
    ];
    let word = "";
    return {
        iterateRow: () => {
            rowIndex++;
            // rowIndex = alphabet.length % rowIndex;
            if (rowIndex >= alphabet.length) {
                rowIndex = 0;
                return rowIndex;
            }
            return rowIndex;
        },
        iterateLetter: () => {
            letterIndex++;
            if(letterIndex >= alphabet[rowIndex].length) {
                letterIndex = 0;
            }
            return alphabet[rowIndex][letterIndex];
        },
        selectLetter: () => {
            if(alphabet[rowIndex][letterIndex].length > 1) {
                $state.go(alphabet[rowIndex][letterIndex]);
            }
            else {
                word += alphabet[rowIndex][letterIndex];
                rowIndex = 0;
                letterIndex = 0;
                return word;
            }
        },
        resetPosition: () => {
            rowIndex = alphabet.length;
        },
        alphabet: alphabet,
        getCurrentLetter: () => {
            return alphabet[rowIndex][letterIndex];
        }
    }
});
