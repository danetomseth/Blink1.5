core.factory('SettingsFactory', function($rootScope, $http, ActionFactory, Session) {
    let user = Session.user;
    let itemIndex = 0;

    // ROWS: "Keyboard", "Features", "NAV"
    let options = [[1, 2, 3, 4, 5], ['eyes', 'eyebrows', 'mouth'], null];

    let currentRow = 0;
    let changeRow = 0;
    let optionsArray;
    let currentOption;
    let changeOption = 0;
    let iterateRow = true;

    $rootScope.$on("iterate", () => {
        if(ActionFactory.isActive('settings')){
            if (iterateRow) {
                settingsObj.selections.row = settingsObj.moveSelected();
            }
            else {settingsObj.selections[currentRow] = settingsObj.iterateOption();}
        }
    });

    $rootScope.$on("singleBlink", () => {
        if(ActionFactory.isActive('settings')){
            if (iterateRow) {
                settingsObj.selectRow();
            }
            else {
                settingsObj.selectOption();
            }
        }
    })

    let settingsObj = {
        selections: {
            row: 0
        },
        moveSelected: () => {
            currentRow = changeRow;
            changeRow = ++changeRow % 3;
            return currentRow;
        },
        selectRow: () => {
            if (currentRow === 2) { // Navbar
                ActionFactory.runEvents('nav');
            }
            else {
                iterateRow = false;
                optionsArray = options[currentRow];
            }
        },
        iterateOption: () => {
            currentOption = changeOption;
            changeOption++;
            if (changeOption > optionsArray.length) {
                changeOption = 1;
            }
            return currentOption;
        },
        selectOption: () => {
            let settingsObj;
            if (changeRow === 0) {
                settingsObj = { "keyboardSpeed": options[0][currentOption] };
            } else {
                settingsObj = { "trackingFeature": options[1][currentOption] };
            }
            iterateRow = true;
            return $http.put('/api/users/' + user._id, settingsObj)
                .then((updatedUser) => angular.copy(updatedUser.data, user));
        },
        // This is used on the calibration page
        setThreshold: (blinkRatio, blinkZero) => {
            $http.put("/api/users", {blinkZero: blinkZero, blinkRatio: blinkRatio})
            .then( user => {
                return user.data;
            })
        }
    }

    return settingsObj;
});
