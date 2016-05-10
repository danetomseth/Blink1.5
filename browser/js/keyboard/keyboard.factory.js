// Basic iteration and letter select/get

core.factory("KeyboardFactory", function($state, PredictFactory) {
    let rowIndex = 0;
    let letterIndex = 0;
    let returnRow;
    let returnLetter;
    const alphabet = [
        ["I", "I'M", "Can", "We", "Hello"],
        ["A", "B", "C", "D", "E"],
        ["F", "G", "H", "I", "J"],
        ["K", "L", "M", "N", "O"],
        ["P", "Q", "R", "S", "T"],
        ["U", "V", "W", "X", "Y"],
        ['space', 'YES', 'NO', 'faces', 'NAV']
    ];
    let rowLength = alphabet[0].length;
    let word = "";

    const predictWords = () => {
            let lastWord = word.split(" ").splice(-1)[0].toLowerCase() // grab the last word from the current sentence
            console.log("looking for suggestions on", lastWord)
            PredictFactory.nextWords(lastWord)
            .then(words => angular.copy(words.splice(0, 5), alphabet[0])); // push the 5 most common words after the last word into the top row.
            word += " "; // add a space that the user asked for
            letterIndex = 0;
            rowIndex = 0;
            return word // send the current word back to the user
    }
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
            if(letterIndex > alphabet[returnRow].length - 1) {
                letterIndex = 0;
            }
            return alphabet[returnRow][returnLetter];
        },
        selectLetter: () => {
            console.log("selected")
            if(returnRow === alphabet.length-1) { // if we are in the last row (which is all operations)
                console.log(2)
                if (alphabet[returnRow][returnLetter] === 'space'){ // when someone selects "space", add a space and check for next words
                    return predictWords() // add a space and update the predicted words
                }
            } else if( returnRow === 0 ){ // if we are on the suggested word row
                console.log(1)
                word += alphabet[returnRow][returnLetter] // adds the word to the sentence
                return predictWords() // adds a space and updates the predicted words.
            }
            else {
                word += alphabet[returnRow][returnLetter]; // otherwise, add the letter to the word and auto-suggest
                letterIndex = 0;
                rowIndex = 0;
                console.log(PredictFactory.completeWord(word))
                angular.copy(PredictFactory.completeWord(word), alphabet[0]);
                console.log("factory word", word)
                return word;
            }
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
