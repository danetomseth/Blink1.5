core.factory('SettingsFactory', function($state, $http) {
    let itemIndex = 0;
    let returnIndex;

    let links = ["settings.keyboard", "settings.features"];

    return {
        moveSelected: () => {
            returnIndex = itemIndex;
            itemIndex++;
            if (itemIndex >= links.length) {
                itemIndex = 0;
            }
            return returnIndex;
        },
        editSettings: (obj, user) => {
            return $http.put('/api/users/' + user._id, obj)
                .then((updatedUser) => updatedUser)
        },
        changeState: () => {
            console.log("Trigger!")
            itemIndex = 0;
            $state.go(links[returnIndex]);
        }
    }
});
