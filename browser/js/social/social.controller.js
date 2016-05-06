core.config(function ($stateProvider) {
    $stateProvider.state('social', {
        url: '/social',
        controller: 'SocialCtrl',
        templateUrl: 'templates/newsfeed.html'
    });
});

core.controller('SocialCtrl', function($scope) {

});
