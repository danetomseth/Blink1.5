core.factory('ActionFactory', function($rootScope, $state) {
    let action = {};
    action.keyboard = false;
    action.home = false;
    action.corners = false;
    action.login = false;
    action.settings = false;
    action.signup = false;
    action.newsfeed = false;
    action.logout = false;



    action.stopEvents = (state) => {
        switch (state) {
            case 'type':
                action.keyboard = false;
                break;
            case 'home':
                action.home = false;
                break;
            case 'corners':
                action.corners = false;
                break;
            case 'login':
                action.login = false;
                break;
            case 'settings':
                action.settings = false;
                break;
            case 'signup':
                action.signup = false;
                break;
            case 'newsfeed':
                action.newsfeed = false;
                break;
            case 'logout':
                action.logout = false;
                break;
        }
    }

    action.startEvents = (state) => {
        switch (state) {
            case 'type':
                action.keyboard = true;
                break;
            case 'home':
                action.home = true;
                break;
            case 'corners':
                action.corners = true;
                break;
            case 'login':
                action.login = true;
                break;
            case 'settings':
                action.settings = true;
                break;
            case 'signup':
                action.signup = true;
                break;
            case 'newsfeed':
                action.newsfeed = true;
                break;
            case 'logout':
                action.logout = true;
                break;
        }
    }

     $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options) {
            console.log('state start', toState, fromState);
            action.stopEvents(fromState.name);

        })

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            console.log('state success', toState);
            action.startEvents(toState.name);
        });


    return action;


});
