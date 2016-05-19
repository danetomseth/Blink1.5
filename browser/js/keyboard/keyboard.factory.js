// Basic iteration and letter select/get

core.factory("KeyboardFactory", function($state, $rootScope, ActionFactory, PredictFactory, SpeechFactory) {
    


    let keyboard = {};

    keyboard.active = false;
    keyboard.scopeValue = [];
    keyboard.selectedLetter;
    keyboard.word = '';

    keyboard.alphabet = [{
        row: 0,
        letters: ["I", "I'M", "CAN", "WE", "HELLO"]
    }, {
        row: 1,
        letters: ["A", "B", "C", "D", "E"]
    }, {
        row: 2,
        letters: ["F", "G", "H", "I", "J"]
    }, {
        row: 3,
        letters: ["K", "L", "M", "N", "O"]
    }, {
        row: 4,
        letters: ["P", "Q", "R", "S", "T"]
    }, {
        row: 5,
        letters: ["U", "V", "W", "X", "Y"]
    }, {
        row: 6,
        letters: ['SPACE', 'SAY', '<<', 'STOP', 'NAV']
    }];

    keyboard.resetKeyboard = () => {
        //want to call this on state change
    }


    let rowIndex = 0;
    let letterIndex = 0;
    let returnRow = 0;
    let returnLetter = 0;
    let lastAction = false;
    let phrase = "";
    let lastState = []
    let selectingLetter = false;
    let rowLength = keyboard.alphabet[0].length;





    const setUndoState = () => {
        if (lastState.length > 5) {
            lastState.shift()
        }
        lastState.push(phrase)
    }

    const resetKeyboardPosition = () => {
        letterIndex = 0;
        rowIndex = 0;
    }

    const predictWords = () => {
        PredictFactory.nextWords(phrase) // sends whole sentence to the predictor where it is spliced
        .then(words => {
            if (words.length > 1) {
                angular.copy(words, keyboard.alphabet[0].letters)
            } // if there are suggestions, push them onto the alphabet array
        });
        setUndoState();
        phrase += " "; // add a space that the user asked for
        return phrase // send the current word back to the user
    }


    const resetDelay = () => {
        setTimeout(() => {
            keyboard.selectedLetter = null;
        }, 500)
    }




    let iterateRow = () => {
        returnRow = rowIndex; // save the row we're at
        (rowIndex > keyboard.alphabet.length - 2) ? rowIndex = 0 : rowIndex++; // if we're at the last row, go to the first row, otherwise, go to the next row
        return [returnRow, null];
    }


    let iterateLetter = () => {
        lastAction = 'row'
        returnLetter = letterIndex; // save the letter we're at
        // if we're at the end of the line, go to the next row
        if (letterIndex > keyboard.alphabet[returnRow].letters.length - 2) {
            letterIndex = 0;
        }
        // Otherwise, increment where we are
        else {
            letterIndex++;
        }
        return returnLetter;
    }

    // let delete = () => { //resets the keyobard position on mouth open
    //     resetKeyboardPosition();
    // }

    let selectLetter = () => {
        lastAction = 'letter';
        resetKeyboardPosition();
        if (returnRow === keyboard.alphabet.length - 1) { // if we are in the last row (which is all operations)
            let action = keyboard.alphabet[returnRow].letters[returnLetter]
            switch (action) {
                case 'SPACE':
                    return predictWords();
                case 'SAY':
                    SpeechFactory.say(phrase); // try to pause the scrolling while we speak stuff
                    setUndoState();
                    phrase = "";
                    return phrase;
                case '<<':
                    setUndoState();
                    return phrase.slice(0, phrase.length - 1);
                case 'NAV':
                    $state.go('home');
                    break;
                case 'STOP':
                    break;
                default:
                    console.log("Error: Action " + action + " not found");
            }
        } else if (returnRow === 0) { // if we are on the suggested word row
            if (phrase.length && phrase[phrase.length - 1] !== " ") { // if the last character isn't a space, replace the whole word
                setUndoState();
                phrase = phrase.replace(/[\w!.,'"/\(\)\-]+$/g, keyboard.alphabet[returnRow].letters[returnLetter]) // repace the last word with the full word
            } else {
                setUndoState();
                phrase += keyboard.alphabet[returnRow].letters[returnLetter]; // adds the word to the sentence
            }
            return predictWords() // adds a space and updates the predicted words.
        } else {
            setUndoState();
            phrase += keyboard.alphabet[returnRow].letters[returnLetter]; // otherwise, add the letter to the word and auto-suggest
            let suggest = PredictFactory.completeWord(phrase); // get suggested autocompletes
            if (suggest.length) {
                angular.copy(suggest, keyboard.alphabet[0].letters)
            }; // every time a letter is typed, if we have suggestions, copy them into the object
            return phrase;
        }
    }

    let doubleBlink = (selectingLetter) => {
        if (lastState.length > 1) { // undo the select that just happened from the first blink
            console.log("popping off last thing", lastState)
            phrase = lastState.pop();

        }
        if (selectingLetter) { // if we are in a row, deselect it
            console.log("deselecting the current row");
            resetKeyboardPosition();
        } else {
            console.log("undoing the last thing, reverting from", phrase, "to", lastState);
            if (lastState.length > 1) {
                phrase = lastState.pop();
                resetKeyboardPosition();
            }
        }
        return phrase
    }



    let endOfRow = () => {
        letterIndex = 0;
    }



    let getCurrentLetter = () => {
        return [returnRow, returnLetter];
    }



    let moveKeyboard = () => {
        if (!selectingLetter) {
            let arr = iterateRow();
            angular.copy(arr, keyboard.scopeValue);
            if (keyboard.scopeValue[0] === 0) {
                //TimerFactory.pauseIteration(250);
            }
        } else if (selectingLetter) {
            if (keyboard.scopeValue[1] === null) {
                //TimerFactory.pauseIteration(250);
            }
            keyboard.scopeValue[1] = iterateLetter();

            if (keyboard.scopeValue[1] === 0) {
                endOfRow();
                keyboard.scopeValue[1] = null;
                selectingLetter = false;
            }
        }
    }


    let selectAction = () => {
        if (selectingLetter) {
            keyboard.selectedLetter = getCurrentLetter();
            keyboard.word = selectLetter();
            console.log('selected letter', keyboard.selectedLetter, keyboard.word);
            selectingLetter = false;
            resetDelay();
        } else {
            keyboard.scopeValue[1] = iterateLetter();
            console.log('selecting row', keyboard.scopeValue[1]);
            selectingLetter = true;
        }
    }


    $rootScope.$on('blink', (event, data) => {
        if (ActionFactory.keyboard) {
            console.log('blink detected!!');
            selectAction();
        }
    });

    $rootScope.$on('doubleBlink', (event, data) => {
        if (ActionFactory.keyboard) {
            doubleBlink();
        }
    });

    $rootScope.$on('iterate', (event, data) => {
        if (ActionFactory.keyboard) {
            console.log('moving!!');
            moveKeyboard();
        }
    })

    return keyboard;


});