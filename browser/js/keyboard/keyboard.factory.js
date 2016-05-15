// Basic iteration and letter select/get

core.factory("KeyboardFactory", function($state, ActionFactory, PredictFactory, SpeechFactory, TimerFactory) {
    let rowIndex = 0;
    let letterIndex = 0;
    let returnRow = 0;
    let returnLetter = 0;

    let alphabet = [
        {row: 0, letters: ["I", "I'M", "CAN", "WE", "HELLO"]},
        {row: 1, letters: ["A", "B", "C", "D", "E"]},
        {row: 2, letters: ["F", "G", "H", "I", "J"]},
        {row: 3, letters: ["K", "L", "M", "N", "O"]},
        {row: 4, letters: ["P", "Q", "R", "S", "T"]},
        {row: 5, letters: ["U", "V", "W", "X", "Y"]},
        {row: 6, letters: ['SPACE', 'SAY', '<<', 'STOP', 'NAV']}
        ];
    const smallKeyboard = [
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

    const predictWords = () => {
            PredictFactory.nextWords(phrase) // sends whole sentence to the predictor where it is spliced
            .then(words => {
                if (words.length > 1) {angular.copy(words, alphabet[0])} // if there are suggestions, push them onto the alphabet array
            });
            phrase += " "; // add a space that the user asked for
            return phrase // send the current word back to the user
    }
    return {
        iterateRow: () => {
            returnRow = rowIndex; // save the row we're at
            (rowIndex > alphabet.length - 2) ? rowIndex = 0 : rowIndex++; // if we're at the last row, go to the first row, otherwise, go to the next row
            return [returnRow, null];
        },
        iterateLetter: () => {
            returnLetter = letterIndex; // save the letter we're at
            // if we're at the end of the line, go to the next row
            if (letterIndex > alphabet[returnRow].letters.length - 2) {
                console.log("end of row")
                letterIndex = 0;
            }
            // Otherwise, increment where we are
            else { letterIndex++; }
            return returnLetter;
        },
        selectLetter: () => {
            resetKeyboardPosition();
            if(returnRow === alphabet.length-1) { // if we are in the last row (which is all operations)
                let action = alphabet[returnRow].letters[returnLetter]
                switch (action){
                    case 'SPACE':
                        return predictWords();
                    case 'SAY':
                        console.log("say")
                        SpeechFactory.say(phrase); // try to pause the scrolling while we speak stuff
                        phrase = ""
                        return phrase
                    case '<<':
                        console.log("delete")
                        return phrase.slice(0, phrase.length-1);
                    case 'NAV':
                        TimerFactory.clearTracking();
                        $state.go('home');
                        break;
                    case 'STOP':
                        TimerFactory.clearTracking();
                    default:
                        console.log("Error: Action "+action+" not found");
                }
            } else if( returnRow === 0 ){ // if we are on the suggested word row
                if (phrase[phrase.length-1] !== " ") {// if the last character isn't a space, replace the whole word
                    phrase = phrase.replace(/[\w!.,'"/\(\)\-]+$/g, alphabet[returnRow].letters[returnLetter]) // repace the last word with the full word
                } else {
                    phrase += alphabet[returnRow].letters[returnLetter]; // adds the word to the sentence
                }
                return predictWords() // adds a space and updates the predicted words.
            }
            else {
                phrase += alphabet[returnRow].letters[returnLetter]; // otherwise, add the letter to the word and auto-suggest
                let suggest = PredictFactory.completeWord(phrase); // get suggested autocompletes
                if (suggest.length) {angular.copy(suggest, alphabet[0].letters)}; // every time a letter is typed, if we have suggestions, copy them into the object
                return phrase;
            }
        },
        resetKeyboard: () => {
            resetKeyboardPosition();
            return [rowIndex, letterIndex];
        },
        alphabet: alphabet, // used in scroll directive
        smallKeyboard: smallKeyboard,
        getCurrentLetter: () => {
            return [returnRow,returnLetter];
        }
    }
});
