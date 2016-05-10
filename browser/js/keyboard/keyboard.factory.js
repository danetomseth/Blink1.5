// Basic iteration and letter select/get

core.factory("KeyboardFactory", function($state) {
    let rowIndex = 0;
    let letterIndex = 0;
    let returnRow;
    let returnLetter;
    const alphabet = [
        ["A", "B", "C", "D", "E"],
        ["F", "G", "H", "I", "J"],
        ["K", "L", "M", "N", "O"],
        ["P", "Q", "R", "S", "T"],
        ["U", "V", "W", "X", "Y"],
        ['space', 'YES', 'NO', 'faces', 'NAV']
    ];
    let rowLength = alphabet[0].length;
    let word = "";
    return {
        iterateRow: () => {
            returnRow = rowIndex;
            rowIndex++;
            if (rowIndex > alphabet.length - 1) {
                rowIndex = 0;
            }
            return returnRow;
        },
        iterateLetter: () => {
            returnLetter = letterIndex;
            letterIndex++;
            if (letterIndex > alphabet[returnRow].length - 1) {
                letterIndex = 0;
            }
            return alphabet[returnRow][returnLetter];
        },
        selectLetter: (nav) => {
            if(nav) {
                console.log('go to nav');
                return '';
            }
            word += alphabet[returnRow][returnLetter];
            letterIndex = 0;
            rowIndex = 0;
            return word;
        },
        resetKeyboard: () => {
            letterIndex = rowLength;
            rowIndex = alphabet.length;
        },
        alphabet: alphabet,
        getCurrentLetter: () => {
            return alphabet[rowIndex][letterIndex];
        }
    }
});