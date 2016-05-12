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
<<<<<<< HEAD
                    $rootScope.user = user;
                    scope.username = user.firstName;
=======
                    if(user) {
                        scope.username = user.firstName;
                        scope.userLoggedIn = true;
                        console.log('user', user);
                    }
                    
                    scope.items = SidebarFactory.getLinks(scope.userLoggedIn);
>>>>>>> master
                });
            };

            var removeUser = function() {
<<<<<<< HEAD
                $rootScope.user = null;
=======
                scope.items = SidebarFactory.getLinks(false);
                scope.username = null;
>>>>>>> master
            };

            setUser();

            scope.items = SidebarFactory.getLinks(scope.userLoggedIn);
            console.log(scope.items);

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
