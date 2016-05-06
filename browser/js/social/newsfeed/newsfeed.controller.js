core.controller('NewsfeedCtrl', function($scope, posts) {
    $scope.posts = posts;

    $scope.data = {
      selectedIndex: 0,
      secondLabel:   "Private Feed",
      thirdLabel: "Other Private Feed"
    };

    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };
    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

});
