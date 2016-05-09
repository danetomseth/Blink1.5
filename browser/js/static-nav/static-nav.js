core.directive('blStaticNav', function() {
	return {
		restrict: 'E',
		controller: 'SidebarCtrl',
		scope: {},
		templateUrl: 'templates/static-nav.html',
		link: function(scope, elem, attr) {

		}
	};
});