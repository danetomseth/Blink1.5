core.directive('blSidebar', function(SidebarFactory, TrackingFactory, TimerFactory, WebcamFactory, $rootScope) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/sidebar.html',
        controller: 'SidebarCtrl',
        link: function(scope) {
            scope.items = SidebarFactory.getLinks();
            //scope.selectedLink = 0;
          
            // function iterateLinks() {
            //     console.log('moving');
            //     if(scope.selectedLink > scope.items.length -1) {
            //         scope.selectedLink = 0;
            //     }
            //     else scope.selectedLink++;
            //     scope.$digest();
            // }

            // scope.selectLinks = () => {
            //     TimerFactory.moveCursor(iterateLinks, 750);
            // }
        }
    }
});

