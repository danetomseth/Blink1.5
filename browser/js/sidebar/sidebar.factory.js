core.factory('SidebarFactory', function($state) {
	let itemIndex = null;
	let links = [
                { label: 'Home', state: 'home' },
                { label: 'Scroll', state: 'scroll' },
                { label: 'Corners', state: 'corners' },
                { label: 'Social', state: 'newsfeed' },
                { label: 'Settings', state: 'settings' },
                { label: 'About', state: 'about' }
            ];
	return {
		moveSelected: () => {
			if(itemIndex === null) {
				itemIndex = 0
				return itemIndex;
			}
			itemIndex++;
			if(itemIndex === links.length) {
				itemIndex = 0;
			}
			return itemIndex;
		},
		changeState: () => {
			console.log(links[itemIndex].state);
			$state.go(links[itemIndex].state)
		},
		getLinks: () => {
			return links;
		}
	}
});