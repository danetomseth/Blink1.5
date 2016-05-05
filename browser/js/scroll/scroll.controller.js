core.config(function ($stateProvider) {
    $stateProvider.state('scroll', {
        url: '/scroll',
        templateUrl: 'templates/scroll.html'
    });
});

// NOT CURRENTLY IN USE
core.controller('ScrollCtrl', function($state, $scope) {
});
