core.factory('SidebarFactory', function($state, $mdSidenav) {

    let itemIndex = 0;
    let returnIndex = 0;

    let links = [
        { label: 'Home', state: 'home'},
        { label: 'Type', state: 'type'},
        { label: 'Corners', state: 'corners'},
    ];

    let loggedInLinks = [
        { label: 'Social', state: 'newsfeed', auth: true},
        { label: 'Settings', state: 'settings', auth: true},
        { label: 'Logout', state: 'logout', auth: true}
    ];

    let loggedOutLinks = [
        { label: 'Login', state: 'login', auth: false},
        { label: 'Signup', state: 'signup', auth: false}
    ];

    let currentLinks;

    return {
        moveSelected: () => {
            returnIndex = itemIndex;
            itemIndex++;
            if(itemIndex >= currentLinks.length) {
                itemIndex = 0;
            }
            return returnIndex;
        },
        getLinks: (loggedIn) => {
            var returnLinks = []
            if(loggedIn) {
                currentLinks = links.concat(loggedInLinks)
                return currentLinks;
            }
            else {
                currentLinks = links.concat(loggedOutLinks);
                return currentLinks;
            }
        },
        changeState: () => {
            itemIndex = 0;
            $state.go(currentLinks[returnIndex].state)
        }
    }
});
