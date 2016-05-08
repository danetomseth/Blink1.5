core.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl',
        onEnter: function() {
        	console.log('Entering home!');
        }
    });

});

core.controller('HomeCtrl', function($scope, $state, $rootScope, SidebarFactory, $mdSidenav) {
    if ($mdSidenav('left').isOpen()) {
        $mdSidenav('left').close();
        $rootScope.sidebarActive = false;
    }
    $scope.links = SidebarFactory.getLinks();
});