core.directive('blAddPost', function(SocialFactory) {
    return {
        restrict: 'E',
        templateUrl: 'templates/new-post.html',
       link: function(scope, elem, attr) {
            scope.post = {
                // author: me
            },
            scope.addPost = function(post) {
                return SocialFactory.addPost(post);
            }
        }
    }
});
