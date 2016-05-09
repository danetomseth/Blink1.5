core.directive('blSidebar', function(SidebarFactory, TrackingFactory, TimerFactory, WebcamFactory, $rootScope, $mdSidenav) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/sidebar.html',
        resolve: {
            sidebarInstance: () => {
                return $mdSidenav('left').then(instance => {
                    return instance;
                });
            }
        },
        controller: 'SidebarCtrl',
        link: function(scope, sidebarInstance) {
            scope.items = SidebarFactory.getLinks();
            scope.selectedLink = 0;

            scope.endWebcam = () => {
                $rootScope.videoActive = false;
                TrackingFactory.endTracking();
                WebcamFactory.endWebcam();
            }


           

            function iterateLinks() {
                console.log('moving');
                if(scope.selectedLink > scope.items.length -1) {
                    scope.selectedLink = 0;
                }
                else scope.selectedLink++;
                scope.$digest();
            }

            scope.selectLinks = () => {
                TimerFactory.moveCursor(iterateLinks, 750);
            }

        }
    }
});

