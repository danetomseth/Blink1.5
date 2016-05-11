// Basic iteration and letter select/get

core.factory("KeyboardFactory", function($state, PredictFactory, SpeechFactory) {
    let rowIndex = 0;
    let letterIndex = 0;
    let returnRow;
    let returnLetter;
    const alphabet = [
        ["I", "I'M", "CAN", "WE", "HELLO"],
        ["A", "B", "C", "D", "E"],
        ["F", "G", "H", "I", "J"],
        ["K", "L", "M", "N", "O"],
        ["P", "Q", "R", "S", "T"],
        ["U", "V", "W", "X", "Y"],
        ['space', 'Speak', 'YES', 'NO', 'NAV']
    ];
    let rowLength = alphabet[0].length;
    let word = "";

    const predictWords = () => {
            PredictFactory.nextWords(word) // sends whole sentence to the predictor where it is spliced
            .then(words => {
                let upperWords = words.splice(0, 5).join(",").toUpperCase().split(",") // take the first 5, convert them to upper case
                angular.copy(upperWords, alphabet[0]) // push them onto the alphabet array
            });
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
            if (letterIndex > alphabet[returnRow].length - 1) {
                letterIndex = 0;
            }
            return alphabet[returnRow][returnLetter];
        },
        selectLetter: () => {
            if(returnRow === alphabet.length-1) { // if we are in the last row (which is all operations)
                if (alphabet[returnRow][returnLetter] === 'space'){ // when someone selects "space", add a space and check for next words
                    return predictWords() // add a space and update the predicted words
                } else if (alphabet[returnRow][returnLetter] === 'Speak'){
                    SpeechFactory.say(word)
                }
            } else if( returnRow === 0 ){ // if we are on the suggested word row
                if (word[word.length-1] !== " ") {// if the last character isn't a space, replace the whole word
                    word = word.replace(/[\w!.,'"/\(\)\-]+$/g, alphabet[returnRow][returnLetter]) // repace the last word with the full word
                } else {
                    word += alphabet[returnRow][returnLetter] // adds the word to the sentence
                }
                return predictWords() // adds a space and updates the predicted words.
            }
            else {
                word += alphabet[returnRow][returnLetter]; // otherwise, add the letter to the word and auto-suggest
                letterIndex = 0;
                rowIndex = 0;
                let suggest = PredictFactory.completeWord(word);
                if (suggest.length) {angular.copy(suggest, alphabet[0])}; // every time a letter is typed, attempt to autocomplete it
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
