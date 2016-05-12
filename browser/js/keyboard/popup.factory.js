// Basic iteration and letter select/get

core.factory("PopupFactory", function($state, ActionFactory, PredictFactory, SpeechFactory) {
    let rowIndex = 0;
    let letterIndex = 0;
    let returnRow = 0;
    let returnLetter = 0;
    let alphabet = [
        {row: 0, letters: ["A", "B", "C", "D", "E"]},
        {row: 1, letters: ["F", "G", "H", "I", "J"]},
        {row: 2, letters: ["K", "L", "M", "N", "O"]},
        {row: 3, letters: ["P", "Q", "R", "S", "T"]},
        {row: 4, letters: ["U", "V", "W", "X", "Y"]}
    ]
    let rowLength = alphabet[0].length;
    let phrase = "";

    const resetKeyboardPosition = () => {
            letterIndex = 0;
            rowIndex = 0;
    }
    
    return {
        iterateRow: () => {
            returnRow = rowIndex; // save the row we're at
            (rowIndex > alphabet.length - 2) ? rowIndex = 0 : rowIndex++; // if we're at the last row, go to the first row, otherwise, go to the next row
            return [returnRow, null];
        },
        iterateLetter: () => {
            returnLetter = letterIndex; // save the letter we're at
            (letterIndex > alphabet[returnRow].letters.length - 2) ? letterIndex = 0 : letterIndex++; // if we're at the end of the line, go back to the start, otherwise, increment where we are
            return returnLetter;
        },
        selectLetter: () => {
            resetKeyboardPosition();
            phrase += alphabet[returnRow].letters[returnLetter];
            return phrase
        },
        alphabet: alphabet, // used in scroll directive
    }
});
