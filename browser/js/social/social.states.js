core.config(function ($stateProvider) {
    $stateProvider.state('newsfeed', {
        url: '/newsfeed',
        controller: 'NewsfeedCtrl',
        templateUrl: 'templates/newsfeed.html',
        resolve: {
            posts: function(SocialFactory) {
                // return first 100 posts
                return SocialFactory.getAllPosts();
            },
            user: function(AuthService) {
                return AuthService.getLoggedInUser();
            },
            messages: function(SocialFactory) {
                return SocialFactory.getAllMessages();
            }
        }
    });

    // $stateProvider.state('messages', {
    //     url: '/messages',
    //     controller: 'MessageCtrl',
    //     templateUrl: 'templates/messages.html',
    //     resolve: {
    //         user: function(AuthService) {
    //             return AuthService.getLoggedInUser();
    //         }
    //     }
    // });
});

