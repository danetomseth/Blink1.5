core.factory("SocialFactory", function($http) {
    return {
        getAllPosts: () => {
            return $http.get('/api/posts')
                .then((posts) => posts.data);
        },
        addFriend: (userId, friendId) => {
            return $http.put('/api/users/' + userId +'/friends', {id: friendId});
        },
        addPost: (post) => {
            return $http.post('/api/posts', {post});
        },

    }
});
