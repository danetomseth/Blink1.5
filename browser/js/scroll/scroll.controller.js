core.config(function ($stateProvider) {
    $stateProvider.state('scroll', {
        url: '/scroll',
        controller: 'ScrollCtrl',
        templateUrl: 'templates/scroll.html'
    });
});

core.controller('ScrollCtrl', function($scope) {

});