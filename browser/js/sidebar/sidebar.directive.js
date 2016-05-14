core.directive('blSidebar', function($state, $rootScope, AuthService, AUTH_EVENTS, SidebarFactory, TimerFactory, IterateFactory) {
    return {
        restrict: 'E',
        scope: {
            control: '='
        },
        templateUrl: 'templates/sidebar.html',
        controller: 'SidebarCtrl',
        link: function(scope) {
            scope.userLoggedIn = false;

            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {

                    $rootScope.user = user;
                    scope.username = user.firstName;
                    if(user) {
                        scope.username = user.firstName;
                        scope.userLoggedIn = true;
                    }
                    scope.items = SidebarFactory.getLinks(scope.userLoggedIn);
                });
            };

            var removeUser = function() {
                $rootScope.user = null;
                scope.items = SidebarFactory.getLinks(false);
            };

            setUser();

            scope.items = SidebarFactory.getLinks(scope.userLoggedIn);

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

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
        }
    }
});
