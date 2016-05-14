core.factory('CornersFactory', function() {

    let boxes = {
        0: {
            type: "letters",
            contents: ["A", 1, "B", 3, "C", 5, "D", 7, "E"]
        },
        2: {
            type: "letters",
            contents: ["F", 1, "G", 3, "H", 5, "I", 7, "J"]
        },
        4: {
            type: "letters",
            contents: ["K", 1, "L", 3, "M", 5, "N", 7, "O"]
        },
        6: {
            type: "letters",
            contents: ["P", 1, "Q", 3, "R", 5, "S", 7, "T"]
        },
        8: {
            type: "letters",
            contents: ["U", 1, "V", 3, "W", 5, "X", 7, "Y"]
        }
    }
    let topBoxes = {
        type: "boxes",
        contents: [boxes[0].contents, "1", boxes[2].contents, "3", boxes[4].contents, "5", boxes[6].contents, "7", boxes[8].contents]
    }
    let phrase = [""]
    let word = ''
    let currentBox = 4;
    let highlightedBox = [4];
    let boxNumber = 0;
    let displayedBoxes = [boxes[0].contents, "1", boxes[2].contents, "3", boxes[4].contents, "5", boxes[6].contents, "7", boxes[8].contents];

    let displayedBoxes = ["1", "2", "3", "4", "...", "5", "6", "7", "8"]
    //let displayedBoxes = ["1", "2", "3", "4", "...", "5", "6", "7", "8"]
    let topLevel = true; // are we at the top level of the grids?



    let functions = {
        highlightBox: (num) => {
            angular.copy([num], highlightedBox);
        },
        getSelected: () => {
            return highlightedBox;
        },
        getBoxes: () => {
            return displayedBoxes
        },
        getPhrase: () => {
            return phrase;
        },
        getWord: () => {
            return word;
        },
        goToBox: (box) => {
            topLevel = !topLevel // switch the state
            //boxNumber = box[0];
            if(topLevel){
                angular.copy(boxes[box].contents, displayedBoxes)
            } else {
                word += boxes[currentBox].contents[box]
                let newPhrase = phrase[0]+= boxes[currentBox].contents[box]
                console.log('word:', word);
                console.log(boxes[currentBox]);
                angular.copy([newPhrase], phrase)
                angular.copy(topBoxes.contents, displayedBoxes)
            }
            // angular.copy(((topLevel) ? boxes[highlightedBox] : boxes.topLevel), displayedBoxes) // ternary, for funsies
            currentBox = highlightedBox[0];
        }
    };
    return functions;
});
