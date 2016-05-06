core.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
    });
});

core.controller('HomeCtrl', function($scope, $state, $rootScope, SidebarFactory) {
    $scope.links = SidebarFactory.getLinks();
});