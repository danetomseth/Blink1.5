core.factory('SettingsFactory', function($state, $rootScope, $http, AuthService) {
    let user = $rootScope.user;
    let itemIndex = 0;
    let returnIndex = 0;
    let returnOption;

    let links = ["settings.keyboard", "settings.features", "NAV"];
    let speeds = [0, 1, 2, 3, 4, 5];
    let features = ['eyes', 'eyebrows', 'mouth'];

    return {
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
            if (returnIndex < 2) {
                $state.go(links[returnIndex]);
            }
            // Nav tab
            else {
                console.log("Returning to nav");
                return "NAV";
            }
        },
        iterateOption: (tabIndex) => {
            let options;
            if (tabIndex === 0) options = speeds;
            else options = features;

            returnOption = itemIndex;
            itemIndex++;
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
        }
    }
});
