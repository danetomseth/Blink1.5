core.controller('NewsfeedCtrl', function($scope, posts) {
    $scope.posts = posts;
    console.log("GOT THE POSTS!")
});
