core.controller('NewsfeedCtrl', function($scope, posts, user, SocialFactory) {
    $scope.user = user;

    SocialFactory.getFriends($scope.user)
        .then((friends) => {
            $scope.allContacts = friends;
        })

    $scope.allPosts = posts;

    $scope.data = {
        selectedIndex: 0
    };

    $scope.next = function() {
        $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
    };
    $scope.previous = function() {
        $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

    $scope.addFeed = function() {
        // Adds a feed to the logged in user
    }

    $scope.addFriend = function(friendId) {
        SocialFactory.addFriend($scope.user._id, friendId);
        $scope.$digest();
    }

    $scope.myFeed = posts.filter((elem) => {
        return $scope.user.friends.indexOf(elem.author._id) > -1;
    });

    // // POST FUNCITONALITY
    //     $scope.newPost = new Post();

    //     $scope.removePost = function(Post) {
    //         Post.destroy()
    //             .then(function() {
    //                 var idx = $scope.stories.indexOf(Post);
    //                 $scope.stories.splice(idx, 1);
    //             });
    //     };

    //     $scope.addPost = function() {
    //         $scope.newPost.save()
    //             .then(function(created) {
    //                 created.author = $scope.newPost.author;
    //                 $scope.newPost = new Post();
    //                 $scope.stories.unshift(created);
    //             });
    //     };
});
