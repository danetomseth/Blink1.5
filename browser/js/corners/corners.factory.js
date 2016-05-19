core.factory('CornersFactory', function() {

    //Not using ng-repeat so only need 5 boxes

    let letterBox = [{
        contents: ["A", "B", "C", "D", "E"]
    }, {
        contents: ["F", "G", "H", "I", "J"]
    }, {
        contents: ["K", "L", "M", "N", "O"]
    }, {
        contents: ["P", "Q", "R", "S", "T"]
    }, {
        contents: ["U", "V", "W", "X", "Y"]
    }];

    /////////////////////////////////////////////////
    //////// 0: TL, 1: TR, 2: M, 3: BL, 4: BR //////
    /////////////////////////////////////////////////

    let gridBoxes = [
        letterBox[0].contents,
        letterBox[1].contents,
        letterBox[2].contents,
        letterBox[3].contents,
        letterBox[4].contents
    ]

    let phrase = [""]
    let word = '';
    let currentBox;
    let displayedBoxes = [];

    let functions = {
        getBoxes: () => {
            angular.copy(gridBoxes, displayedBoxes);
            return displayedBoxes;
        },
        initialize: () => {
            return gridBoxes;
        },
        getPhrase: () => {
            return phrase;
        },
        getWord: () => {
            return word;
        },
        delete: () => {
            let newPhrase = phrase[0].slice(0, -2);
            angular.copy([newPhrase], phrase)
        },
        goToBox: (box) => {
            angular.copy(gridBoxes[box], displayedBoxes);
            currentBox = box;
        },
        select: (box) => {
            word += gridBoxes[currentBox][box];
            let newPhrase = phrase[0] += gridBoxes[currentBox][box]
            angular.copy([newPhrase], phrase)
            angular.copy(gridBoxes, displayedBoxes)
        }
    };
    return functions;
});
