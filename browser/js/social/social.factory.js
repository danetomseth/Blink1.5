core.factory("SocialFactory", function($http, $rootScope) {

    return {
        getAllPosts: () => {
            return $http.get('/api/posts')
                .then((posts) => posts.data);
        },
        addFriend: (userId, friendId) => {
            return $http.put('/api/users/' + userId +'/friends', {id: friendId});
        },
        addThread: (threadObj) => {
            return $http.post('/api/threads', threadObj);
        },
        addPost: (post) => {
            return $http.post('/api/posts', post);
        },
        getFriends: (user) => {
            return $http.get('/api/users/' + user._id)
            .then((user) => {
                return user.data.friends;
            } )
        }
    }
});
