core.directive('blSidebar', function($state, $rootScope, AuthService, AUTH_EVENTS, SidebarFactory, TimerFactory, IterateFactory) {
    return {
        restrict: 'E',
        scope: {
            control: '='
        },
        templateUrl: 'templates/sidebar.html',
        controller: 'SidebarCtrl',
        link: function(scope) {
            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {
                    //scope.username = user.firstName;
                });
            };

            var removeUser = function() {
                scope.username = null;
            };

            setUser();

            scope.items = SidebarFactory.getLinks();

            scope.show = function(parameter) {
                if (parameter === 'isLoggedIn') return !!(scope.username);
                else if (parameter === 'isLoggedOut') return !(scope.username);
                else return true;
            }

            //need to clean up scope.localCtrl .... was originally used to link stuff
            scope.localCtrl = scope.control || {};
            let count = 0;
            scope.selectedLink = IterateFactory.linkValue;

            scope.$watch(function() {
                return IterateFactory.linkValue;
            }, function(newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    scope.selectedLink = IterateFactory.linkValue;
                }
            });
            //IterateFactory.zero('nav');


            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
        }
    }
});
