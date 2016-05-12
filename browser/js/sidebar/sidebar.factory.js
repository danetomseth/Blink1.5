
core.factory('SidebarFactory', function($state, AuthService, TimerFactory, $mdSidenav) {

    let itemIndex = 0;
    let returnIndex;
    var isLoggedIn = true;

    let links = [
        { label: 'Home', state: 'home', show: 'always'},
        { label: 'Type', state: 'type', show: 'always'},
        { label: 'Corners', state: 'corners', show: 'always'},
        { label: 'Social', state: 'newsfeed', show: 'isLoggedIn'},
        { label: 'Settings', state: 'settings', show: 'isLoggedIn'},
        { label: 'Login', state: 'login', show: "isLoggedOut"},
        { label: 'Signup', state: 'signup', show: 'isLoggedOut'}
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
        }
    }
});
