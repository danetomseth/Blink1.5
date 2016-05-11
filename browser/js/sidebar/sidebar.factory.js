
core.factory('SidebarFactory', function($state, AuthService, TimerFactory, $mdSidenav) {

    let itemIndex = 0;
    let returnIndex;
    let isLoggedIn = !!(AuthService.isAuthenticated());
    console.log("IS LOGGED IN", isLoggedIn)
    let links = [
        { label: 'Home', state: 'home', show: true},
        { label: 'Type', state: 'scroll', show: true},
        { label: 'Corners', state: 'corners', show: true},
        { label: 'Social', state: 'newsfeed', show: isLoggedIn},
        { label: 'Settings', state: 'settings', show: isLoggedIn},
        { label: 'Login', state: 'login', show: !isLoggedIn},
        { label: 'Signup', state: 'signup', show: !isLoggedIn}
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
        checkLogin: () => {
            isLoggedIn = !!(AuthService.isAuthenticated());
        }
    }
});
