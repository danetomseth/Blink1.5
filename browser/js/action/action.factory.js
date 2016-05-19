core.factory('ActionFactory', function($rootScope, $state) {
    let action = {};
    let states = {};
    states.type = false;
    states.home = false;
    states.corners = false;
    states.login = false;
    states.settings = false;
    states.signup = false;
    states.newsfeed = false;
    states.logout = false;
    states.nav = false; // Not really a state. But convenient

    action.states = states;


    action.stopEvents = (state) => {
        if(state){
            states[state] = false;
        } else {
            Object.keys(states).forEach(state => {
                states[state] = false;
            });
        }
    }

    action.runEvents = () => {
        action.stopEvents();
        Array.from(arguments).forEach(state => {
            states[state] = true;
        });
    }

    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options) {
            console.log('state start', toState, fromState);
            action.stopEvents('nav');
            action.stopEvents(fromState.name);

        })

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            console.log('state success', toState);
            action.runEvents(toState.name);
        });

    action.isActive = (state) => {
        return states[state];
    }


    return action;


});
