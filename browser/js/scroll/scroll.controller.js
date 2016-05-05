core.config(function ($stateProvider) {
    $stateProvider.state('scroll', {
        url: '/scroll',
        controller: 'ScrollCtrl',
        templateUrl: 'templates/scroll.html'
    });
});

core.controller('ScrollCtrl', function($state, $scope, KeyboardFactory, ClmFactory) {
	var currentState = $state.is('scroll');
	if(!currentState) {
        console.log('no tracking!!!');
    } 
    $scope.changeState = function () {
        console.log('changing');
    };
});