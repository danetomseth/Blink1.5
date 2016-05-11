// Basic iteration and letter select/get

core.factory("PopupFactory", function($state, ActionFactory, PredictFactory, SpeechFactory) {
    let rowIndex = 0;
    let letterIndex = 0;
    let returnRow = 0;
    let returnLetter = 0;
    const alphabet = [
        ["A", "B", "C", "D", "E"],
        ["F", "G", "H", "I", "J"],
        ["K", "L", "M", "N", "O"],
        ["P", "Q", "R", "S", "T"],
        ["U", "V", "W", "X", "Y"]
    ];
    let rowLength = alphabet[0].length;
    let phrase = "";

    const resetKeyboardPosition = () => {
            letterIndex = 0;
            rowIndex = 0;
    }
    
    return {
        iterateRow: () => {
            returnRow = rowIndex; // save the row we're at
            (rowIndex > alphabet.length - 1) ? rowIndex = 0 : rowIndex++; // if we're at the last row, go to the first row, otherwise, go to the next row
            return returnRow;
        },
        iterateLetter: () => {
            returnLetter = letterIndex; // save the letter we're at
            (letterIndex > alphabet[returnRow].length - 1) ? letterIndex = 0 : letterIndex++; // if we're at the end of the line, go back to the start, otherwise, increment where we are
            return alphabet[returnRow][returnLetter];
        },
        selectLetter: () => {
            if(returnRow === alphabet.length-1) { // if we are in the last row (which is all operations)
                let action = alphabet[returnRow][returnLetter]
                
            } 
            else {
                phrase += alphabet[returnRow][returnLetter]; // otherwise, add the letter to the word and auto-suggest
                resetKeyboardPosition()
                return phrase;
            }
        },
        alphabet: alphabet, // used in scroll directive
        getCurrentLetter: () => {
            return alphabet[rowIndex][letterIndex];
        }
    }
});
