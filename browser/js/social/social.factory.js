core.factory("SocialFactory", function($http, $rootScope) {
    let itemIndex = 0;
    let returnIndex = 0;
    let returnOption;

    let links = ["All Feeds", "My Feeds", "My Messages", "New Message", "NAV"];

    return {
        getAllPosts: () => {
            return $http.get('/api/posts')
                .then((posts) => posts.data);
        },
        getAllMessages: () => {
            return $http.get('/api/messages')
                .then((messages) => messages.data);
        },
        addFriend: (userId, friendId) => {
            return $http.put('/api/users/' + userId +'/friends', {id: friendId});
        },
        addThread: (threadObj) => {
            return $http.post('/api/threads', threadObj)
            .then((thread) => thread.data);
        },
        addPost: (post) => {
            return $http.post('/api/posts', post)
            .then((post) => post.data);
        },
        getFriends: (user) => {
            return $http.get('/api/users/' + user._id)
            .then((user) => {
                return user.data.friends;
            } )
        },
        // FOR ITERATE FACTORY
        moveSelected: () => {
            returnIndex = itemIndex;
            itemIndex++;
            if (itemIndex >= links.length) {
                itemIndex = 0;
            }
            return returnIndex;
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
        viewPage: () => {
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
    }
});
