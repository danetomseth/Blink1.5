core.config(function ($stateProvider) {
    $stateProvider.state('corners', {
        url: '/corners',
        controller: 'CornersCtrl',
        templateUrl: 'templates/corners.html',
        onEnter: function(IterateFactory) {
            IterateFactory.zero('corners');
        }
    });
});

core.controller('CornersCtrl', function($scope, CornersFactory, IterateFactory) {
});
