core.directive('blSidebar', function($state, SidebarFactory, TimerFactory, IterateFactory) {
    return {
        restrict: 'E',
        scope: {
            control: '='
        },
        templateUrl: 'templates/sidebar.html',
        controller: 'SidebarCtrl',
        link: function(scope) {

            scope.items = SidebarFactory.getLinks();

            //need to clean up scope.localCtrl .... was originally used to link stuff
            scope.localCtrl = scope.control || {};
            let count = 0;
            scope.selectedLink = IterateFactory.linkValue;

            scope.$watch(function() {
                return IterateFactory.linkValue
            }, function(newVal, oldVal) {
                console.log('change!!', newVal);
                if (typeof newVal !== 'undefined') {
                    scope.selectedLink = IterateFactory.linkValue;
                }
            });
            //IterateFactory.zero('nav');

        }
    }
});
