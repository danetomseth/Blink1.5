core.directive('blSidebar', function(SidebarFactory, TrackingFactory, WebcamFactory, $rootScope, $mdSidenav) {
    return {
        restrict: 'E',
        controller: 'SidebarCtrl',
        scope: {},
        templateUrl: 'templates/sidebar.html',
        link: function(scope) {
            scope.items = SidebarFactory.getLinks();

            scope.endWebcam = () => {
                $rootScope.videoActive = false;
                TrackingFactory.endTracking();
                WebcamFactory.endWebcam();
            }

            scope.hideSidebar = () => {
            	$mdSidenav('left').toggle();
            	$rootScope.sidebarActive = !$rootScope.sidebarActive
            }
        }
    }
});