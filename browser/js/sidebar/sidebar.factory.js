core.factory('SidebarFactory', function($state, $mdSidenav, ActionFactory) {

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

    let userLinks = []

    return {
        moveSelected: () => {
            returnIndex = itemIndex;
            itemIndex++;
            if(itemIndex >= userLinks.length) {
                itemIndex = 0;
            }
            console.log(returnIndex);
            return returnIndex;
        },
        getLinks: (loggedIn) => {
            var returnLinks = []
            if(loggedIn) {
                userLinks = links.concat(loggedInLinks);
                return userLinks

            }
            else {
                userLinks = links.concat(loggedOutLinks);
                return userLinks
            }
        },
        changeState: () => {
            itemIndex = 0;
            console.log("GOING TO ",userLinks[returnIndex].state)
            $state.go(userLinks[returnIndex].state, null, {reload: true})
        }
    }
});
