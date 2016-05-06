core.config(function ($stateProvider) {
    $stateProvider.state('newsfeed', {
        url: '/newsfeed',
        controller: 'NewsfeedCtrl',
        templateUrl: 'templates/newsfeed.html',
        resolve: {
            posts: function(SocialFactory) {
                // return first 100 posts
                return SocialFactory.getAllPosts();
            }
        }
    });
});

