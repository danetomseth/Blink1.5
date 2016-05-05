core.factory("SocialFactory", function($http) {
    return {
        getAllPosts: () => {
            return $http.get('/api/posts')
                .then((posts) => posts.data);
        }
    }
});
