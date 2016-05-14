core.factory('CornersFactory', function() {

    // let boxes = {
    //     0: {
    //         type: "letters",
    //         contents: ["A", 1, "B", 3, "C", 5, "D", 7, "E"]
    //     },
    //     2: {
    //         type: "letters",
    //         contents: ["F", 1, "G", 3, "H", 5, "I", 7, "J"]
    //     },
    //     4: {
    //         type: "letters",
    //         contents: ["K", 1, "L", 3, "M", 5, "N", 7, "O"]
    //     },
    //     6: {
    //         type: "letters",
    //         contents: ["P", 1, "Q", 3, "R", 5, "S", 7, "T"]
    //     },
    //     8: {
    //         type: "letters",
    //         contents: ["U", 1, "V", 3, "W", 5, "X", 7, "Y"]
    //     }
    // }
    // let topBoxes = {
    //     type: "boxes",
    //     contents: [boxes[0].contents, "1", boxes[2].contents, "3", boxes[4].contents, "5", boxes[6].contents, "7", boxes[8].contents]
    // }

    

    //Not using ng-repeat so only need 5 boxes

    let letterBox = [
        {
            contents: ["A", "B", "C", "D", "E"]
        },
        {
            contents: ["F", "G", "H", "I", "J"]
        },
        {
            contents: ["K", "L", "M", "N", "O"]
        },
        {
            contents: ["P", "Q", "R", "S", "T"]
        },
        {
            contents: ["U", "V", "W", "X", "Y"]
        }
    ];

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


    let currentBox = 4;

    //sets initial box highlight
    let boxNumber = 0;

    let displayedBoxes = ['', '', "X", '', ''];
    let topLevel = true; // are we at the top level of the grids?


    let functions = {
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
            if(topLevel){
                angular.copy(gridBoxes[box], displayedBoxes)
            } else {
                word += gridBoxes[currentBox][box]
                let newPhrase = phrase[0]+= gridBoxes[currentBox][box]
                console.log('word:', word);
                console.log(gridBoxes[currentBox]);
                angular.copy([newPhrase], phrase)
                angular.copy(gridBoxes, displayedBoxes)
            }
            currentBox = box;
            return word;
        }
    };
    return functions;
});
