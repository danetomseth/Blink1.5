core.directive('blStaticNav', function() {
	return {
		restrict: 'E',
		controller: 'SidebarCtrl',
		scope: {},
		templateUrl: 'templates/static-nav.html',
		resolve: {
            sidebarInstance: () => {
                return $mdSidenav('left').then(instance => {
                    return instance;
                });
            }
        },
		link: function(scope, elem, attr) {

		}
	};
});