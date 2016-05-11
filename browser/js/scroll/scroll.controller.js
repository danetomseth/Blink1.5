core.config(function ($stateProvider) {
    $stateProvider.state('scroll', {
        url: '/scroll',
        templateUrl: 'templates/scroll.html',
        onEnter: function(IterateFactory) {
        	//this starts nav iteration on home page
        	console.log('Entering scroll!');
        	IterateFactory.zero('scroll');
        }
    });
});

// NOT CURRENTLY IN USE
core.controller('ScrollCtrl', function($state, $scope) {
});
