core.controller('NewsfeedCtrl', function($scope, posts, user, SocialFactory) {
    var me = user;

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
      SocialFactory.addFriend(me._id, friendId);
      $scope.$digest();
    }

    $scope.myFeed = posts.filter((elem) => {
        return me.friends.indexOf(elem.author._id) > -1;
    }

    );
});
