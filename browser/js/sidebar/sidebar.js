core.directive('blSidebar', function(SidebarFactory, TrackingFactory, TimerFactory, WebcamFactory, PositionFactory) {
    return {
        restrict: 'E',
        scope: {
            control: '='
        },
        templateUrl: 'templates/sidebar.html',
        controller: 'SidebarCtrl',
        link: function(scope) {
            scope.items = SidebarFactory.getLinks();
            scope.localCtrl = scope.control || {};
            let count = 0;
            

            function linkIterator() {
                scope.selectedLink = SidebarFactory.moveSelected();
                scope.$digest();
            }

            function goToPage() {
                TimerFactory.clearAll();
                SidebarFactory.changeState();
            }

            function readPositions() {
                var positions = TrackingFactory.getPositions();
                if (positions) {
                    if (PositionFactory.browCompare(positions)) {
                        TimerFactory.clearTracking();
                        scope.selectedLink = null;
                        goToPage();
                    }
                }
            }

            scope.localCtrl.browZero = function() {
                var positions = TrackingFactory.getPositions();
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(readPositions, 50);
                TimerFactory.moveCursor(linkIterator, 1000);
            }
            
            function setZero() {
                var converge = TrackingFactory.convergence();
                if (converge < 300) {
                    count++;
                    if (count > 20) {
                        TimerFactory.calibrationFinished();
                        scope.localCtrl.browZero();
                    }
                } else {
                    count = 0;
                }
            }

            scope.localCtrl.selectLinks = () => {
                TimerFactory.calibrate(setZero, 50);
            }
        }
    }
});