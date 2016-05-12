core.factory('SidebarFactory', function($state, $mdSidenav) {

    let itemIndex = 0;
    let returnIndex;

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

    return {
        moveSelected: () => {
            returnIndex = itemIndex;
            itemIndex++;
            if(itemIndex >= links.length) {
                itemIndex = 0;
            }
            return returnIndex;
        },
        getLinks: (loggedIn) => {
            var returnLinks = []
            if(loggedIn) {
                return links.concat(loggedInLinks);
            }
            else return links.concat(loggedOutLinks);
            
        },
        changeState: () => {
            itemIndex = 0;
            $state.go(links[returnIndex].state)
        }
    }
});
