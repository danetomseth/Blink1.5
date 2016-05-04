core.directive('blSidebar', function() {
	return {
		restrict: 'E',
		scope: {},
		templateUrl: '/templates/sidebar.html',
		link: function(scope) {
			scope.items = [
                { label: 'Home', state: 'home' },
                { label: 'Scroll', state: 'scroll' },
                { label: 'Corners', state: 'corners' },
                { label: 'Social', state: 'social' },
                { label: 'Settings', state: 'settings' },
                { label: 'About', state: 'about' }
            ];
		}
	}
});