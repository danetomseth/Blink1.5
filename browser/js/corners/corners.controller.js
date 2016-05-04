core.config(function ($stateProvider) {
    $stateProvider.state('corners', {
        url: '/corners',
        controller: 'CornersCtrl',
        templateUrl: 'templates/corners.html'
    });
});

core.controller('CornersCtrl', function($scope, CornersFactory) {
	$scope.tiles = [{color: '#455A64'}, {color: '#607D8B'},{color: '#727272'},{color: '#727272'},{color: '#03A9F4'},{color: '#455A64'}, {color: '#455A64'}, {color: '#607D8B'},{color: '#727272'}]
});