// Basic iteration and letter select/get

core.factory("KeyboardFactory", function($state, ActionFactory, PredictFactory, SpeechFactory) {
    let rowIndex = 0;
    let letterIndex = 0;
    let returnRow = 0;
    let returnLetter = 0;
    const alphabet = [
        ["I", "I'M", "CAN", "WE", "HELLO"],
        ["A", "B", "C", "D", "E"],
        ["F", "G", "H", "I", "J"],
        ["K", "L", "M", "N", "O"],
        ["P", "Q", "R", "S", "T"],
        ["U", "V", "W", "X", "Y"],
        ['SPACE', 'SAY', '<<', 'NO', 'NAV']
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
            resetKeyboardPosition(); // go back to the start of
            return phrase // send the current word back to the user
    }
    return {
        iterateRow: () => {
            returnRow = rowIndex; // save the row we're at
            // rowIndex++;
            (rowIndex > alphabet.length - 1) ? rowIndex = 0 : rowIndex++; // if we're at the last row, go to the first row, otherwise, go to the next row
            // if (rowIndex > alphabet.length - 1) {
            //     rowIndex = 0;
            // }
            // console.log("returnRow", returnRow)
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
                switch (action){
                    case 'SPACE':
                        console.log("space")
                        return predictWords();
                        // break;
                    case 'SAY':
                        console.log("say")
                        SpeechFactory.say(phrase); // try to pause the scrolling while we speak stuff
                        phrase = ""
                        return phrase
                        break;
                    case '<<':
                        console.log("delete")
                        return phrase.slice(0, phrase.length-1)
                        // break;
                    default:
                        console.log("Error: Action "+action+" not found");
                }
            } else if( returnRow === 0 ){ // if we are on the suggested word row
                if (phrase[phrase.length-1] !== " ") {// if the last character isn't a space, replace the whole word
                    phrase = phrase.replace(/[\w!.,'"/\(\)\-]+$/g, alphabet[returnRow][returnLetter]) // repace the last word with the full word
                } else {
                    phrase += alphabet[returnRow][returnLetter] // adds the word to the sentence
                }
                return predictWords() // adds a space and updates the predicted words.
            }
            else {
                phrase += alphabet[returnRow][returnLetter]; // otherwise, add the letter to the word and auto-suggest
                resetKeyboardPosition()
                let suggest = PredictFactory.completeWord(phrase); // get suggested autocompletes
                if (suggest.length) {angular.copy(suggest, alphabet[0])}; // every time a letter is typed, if we have suggestions, copy them into the object
                return phrase;
            }
        },
        // resetKeyboard: () => {
        //     letterIndex = rowLength;
        //     rowIndex = alphabet.length;
        // },
        alphabet: alphabet, // used in scroll directive
        smallKeyboard: smallKeyboard,
        getCurrentLetter: () => {
            return alphabet[rowIndex][letterIndex];
        }
    }
});
