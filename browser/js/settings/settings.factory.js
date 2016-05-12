core.factory('SettingsFactory', function($state, $http, AuthService) {
    let user;
    let itemIndex = 0;
    let returnIndex = 0;
    let returnOption;
    let mode;

    let links = ["settings.keyboard", "settings.features"];
    let speeds = [0, 1, 2, 3, 4, 5];
    let features = ['eyes', 'eyebrows', 'mouth'];

    AuthService.getLoggedInUser()
    .then((loggedInUser) => user = loggedInUser);

    return {
        user: () => {
            return user;
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
            $state.go(links[returnIndex]);
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

            return $http.put('/api/users/' + user._id, selections)
                .then((updatedUser) => updatedUser);
        }
    }
});
