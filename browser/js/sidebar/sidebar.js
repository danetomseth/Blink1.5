core.directive('blSidebar', function(SidebarFactory) {
	return {
		restrict: 'E',
        controller: 'SidebarCtrl',
		scope: {},
		templateUrl: 'templates/sidebar.html',
		link: function(scope) {
			scope.items = SidebarFactory.getLinks();
		}
	}
});
