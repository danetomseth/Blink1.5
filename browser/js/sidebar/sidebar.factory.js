core.factory('SidebarFactory', function($state, TimerFactory, TrackingFactory, PositionFactory) {
	let itemIndex = 0;
	let count = 0;
	let returnIndex;
	let links = [
	{ label: 'Home', state: 'home' },
	{ label: 'Type', state: 'scroll' },
	{ label: 'Corners', state: 'corners' },
	{ label: 'Social', state: 'newsfeed' },
	{ label: 'Settings', state: 'settings' },
	{ label: 'About', state: 'about' }
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
		getLinks: () => {
			return links;
		},
		changeState: () => {
			itemIndex = 0;
			$state.go(links[returnIndex].state)
		},
	}
});