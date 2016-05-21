core.factory('CornersFactory', function($rootScope, ActionFactory, ConstantsFactory) {

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

    let calibrated = false;

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
    let mainGrid = true;

    $rootScope.$on("changeBox", function(thing, box) {
        if (ActionFactory.isActive('corners') && ConstantsFactory.pupilsCalibrated) {
            console.log('current box', box);
            CornersFactory.selectedBox = box;
        }
    });

    $rootScope.$on("singleBlink", function() {
        if (ActionFactory.isActive('corners') && ConstantsFactory.pupilsCalibrated) {
            if (mainGrid) {
                CornersFactory.goToBox(CornersFactory.selectedBox);
            } else {
                console.log('corners box:',CornersFactory.selectedBox);
                CornersFactory.select(CornersFactory.selectedBox);
            }
        }
    })

    $rootScope.$on("doubleBlink", function() {
        if (ActionFactory.isActive('corners')) {
            if (mainGrid) {
                CornersFactory.delete();
            } else {
                CornersFactory.goToBox();
            }
        }
    })

    let CornersFactory = {
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
            angular.copy([newPhrase], phrase);
        },
        goToBox: (box) => {
            angular.copy(gridBoxes[box], displayedBoxes);
            currentBox = box;
            mainGrid = !mainGrid;
        },
        select: (box) => {
            word += gridBoxes[currentBox][box];
            let newPhrase = phrase[0] += gridBoxes[currentBox][box];
            angular.copy([newPhrase], phrase);
            angular.copy(gridBoxes, displayedBoxes);
            mainGrid = !mainGrid;
        },
        selectedBox: 2,
        calibrated: calibrated
    };
    return CornersFactory;
});