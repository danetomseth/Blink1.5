core.factory('SettingsFactory', function($state, $rootScope, $http, ActionFactory, AuthService) {
    let user = $rootScope.user;
    let itemIndex = 0;
    let returnIndex = 0;
    let returnOption;

    let links = ["settings.keyboard", "settings.features", "NAV"];
    let speeds = [0, 1, 2, 3, 4, 5];
    let features = ['eyes', 'eyebrows', 'mouth'];
    let options = speeds;

    let settings = ActionFactory.isActive('settings');
    let keyboard = ActionFactory.isActive('settings.keyboard');
    let features = ActionFactory.isActive('settings.features');

    $rootScope.$on("iterate", () => {
        if(settings && !keyboard && !features ){
            settingsObj.selections.selectedTab = settingsObj.moveSelected();
        }
        else if(keyboard || features) {
            settingsObj.selections.highlighted = settingsObj.iterateOption();
        }
    })

    $rootScope.$on("singleBlink", () => {
        if(settings && !keyboard && !features){
            settingsObj.changeState();
        }
        else if(keyboard || features) {
            settingsObj.selectOption();
        }
    })

    let settingsObj = {
        selections: {
            selectedTab: 0,
            highlighted: 0
        },
        moveSelected: () => {
            returnIndex = itemIndex;
            itemIndex++;
            if (itemIndex >= links.length) {
                itemIndex = 0;
            }
            return returnIndex;
        },
        changeState: () => {
            itemIndex = 0;
            // Settings tabs
            if (links[returnIndex] !== "NAV") {
                console.log("return index", returnIndex)
                options = (returnIndex === 0)? speeds:features;
                $state.go(links[returnIndex]);
            }
            // Nav tab
            else {
                ActionFactory.runEvents('nav');
            }
        },
        iterateOption: () => {
            returnOption = itemIndex;
            itemIndex++;
            console.log("options are", options)
            if (itemIndex >= options.length) {
                itemIndex = 0;
            }
            return returnOption;
        },
        selectOption: () => {
            let selections;
            if (returnIndex === 0) {
                selections = { "keyboardSpeed": speeds[returnOption] };
            } else {
                selections = { "trackingFeature": features[returnOption] };
            }
            return $http.put('/api/users/' + $rootScope.user._id, selections)
                .then((updatedUser) => angular.copy(updatedUser.data, $rootScope.user));
        },
        setThreshold: (blinkRatio, blinkZero) => {
            $http.put("/api/users", {blinkZero: blinkZero, blinkRatio: blinkRatio})
            .then( user => {
                return user.data;
            })
        },
        // getBlinkZero: () => { // Use Session.user.blinkZero instead.
        //     return user.blinkZero;
        // },
        // getBlinkRatio: () => {
        //     return user.blinkRatio;
        // }
    }

    return settingsObj;
});
