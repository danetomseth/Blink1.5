core.config(function ($stateProvider) {
    $stateProvider.state('corners', {
        url: '/corners',
        controller: 'CornersCtrl',
        templateUrl: 'templates/corners.html',
        onEnter: function(IterateFactory) {
            //this starts nav iteration on home page
            console.log('Entering corners');
            IterateFactory.zero('corners');
        }
    });
});

core.controller('CornersCtrl', function($scope, CornersFactory, IterateFactory) {
    // IterateFactory.zero('corners');
});
