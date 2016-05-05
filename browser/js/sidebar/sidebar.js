core.directive('blSidebar', function() {
	return {
		restrict: 'E',
        controller: 'SidebarCtrl',
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
            //
            scope.sidebar;


            //hide sidebar based on view

            // scope.hideSide = (state) => {
            // 	scope.sidebar = true;
            // 	if(state !== 'home') {
            // 		scope.sidebar = true;
            // 		console.log('hiding');

            // 	}
            // 	else scope.sidebar = false;;
            // }
		}
	}
});
