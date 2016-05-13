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
    let currentBox = 4;
    let selectedBox = [4];
    // let displayedBoxes = [boxes[0].contents, "1", boxes[2].contents, "3", boxes[4].contents, "5", boxes[6].contents, "7", boxes[8].contents];

    let displayedBoxes = ["1", "2", "3", "4", "Look Here", "5", "6", "7", "8"]
    let topLevel = true; // are we at the top level of the grids?

    // Base eye position
    let zero;

    // position tracking rolling average
    let xAvg = [0,0,0,0]
    let yAvg = [0,0,0,0]

    // threshold variables
    let threshold = 1;

    let functions = {
        eyePosition: (eyeX, eyeY) => {
            xAvg.shift()
            xAvg.push(eyeX)
            let xAvgNum = 0
            for(var i in xAvg) {
                xAvgNum += xAvg[i]
            }
            xAvgNum = xAvgNum/xAvg.length;
            yAvg.shift()
            yAvg.push(eyeY)
            let yAvgNum = 0
            for(var i in yAvg) {
                yAvgNum += yAvg[i]
            }
            yAvgNum = yAvgNum/yAvg.length;
            var xDiff = zero[0] - xAvgNum;
            var yDiff = zero[1] - yAvgNum;
            xDiff = (xDiff).toFixed(1);
            yDiff = (yDiff).toFixed(1);
            if (xDiff < -threshold && yDiff > threshold) { // LEFT TOP
                console.log("TL")
                functions.selectBox(0);
            } else if (xDiff > threshold && yDiff > threshold) { // RIGHT TOP
                console.log("TR")
                functions.selectBox(2);
            } else if (xDiff > threshold && yDiff < -threshold) { // BOTTOM RIGHT
                console.log("BR")
                functions.selectBox(8);
            } else if (xDiff < -threshold && yDiff < -threshold) { // BOTTOM LEFT
                console.log("BL")
                functions.selectBox(6);
            }
        },
        getPosition: () => {

        },
        selectBox: (num) => {
            angular.copy([num], selectedBox);
        },
        getSelected: () => {
            return selectedBox;
        },
        getBoxes: () => {
            return displayedBoxes
        },
        getPhrase: () => {
            return phrase;
        },
        goToBox: () => {
            topLevel = !topLevel // switch the state
            if(topLevel){
                angular.copy(boxes[selectedBox].contents, displayedBoxes)
            } else {
                let newPhrase = phrase[0]+= boxes[currentBox].contents[selectedBox[0]]
                angular.copy([newPhrase], phrase)
                angular.copy(topBoxes.contents, displayedBoxes)
            }
            // angular.copy(((topLevel) ? boxes[selectedBox] : boxes.topLevel), displayedBoxes) // ternary, for funsies
            currentBox = selectedBox[0];
        },
        setZero: (arr) => {
            zero = arr
        }
    };
    return functions;
});
