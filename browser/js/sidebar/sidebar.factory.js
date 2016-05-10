core.factory('SidebarFactory', function($state, TimerFactory, $mdSidenav) {
	let itemIndex = 0;
	let returnIndex;
	let links = [
                { label: 'Home', state: 'home' },
                { label: 'Type', state: 'scroll' },
                { label: 'Corners', state: 'corners' },
                { label: 'Social', state: 'newsfeed' },
                { label: 'Settings', state: 'settings' },
                { label: 'Login', state: 'login' }
            ];
	return {
		moveSelected: () => {
			returnIndex = itemIndex;
			itemIndex++;
			if(itemIndex >= links.length) {
				itemIndex = 0;
			}
			return returnIndex;
		},
		changeState: () => {
			$mdSidenav('left').close();
			if(links[returnIndex].state === 'exit') TimerFactory.clearAll();
			else $state.go(links[returnIndex].state)
		},
		getLinks: () => {
			return links;
		},
		openSidebar: () => {
			$mdSidenav('left').open();
		},
		closeSidebar: () => {
			$mdSidenav('left').close();
		}
	}
});
