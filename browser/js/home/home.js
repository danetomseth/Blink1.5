core.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl',
        onEnter: function(IterateFactory) {
        	//this starts nav iteration on home page
        	console.log('Entering home!');
        	IterateFactory.zero('nav');
        }
    });

});

core.controller('HomeCtrl', function($scope, $state, $rootScope, SidebarFactory) {
    $scope.links = SidebarFactory.getLinks();
});