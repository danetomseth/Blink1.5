core.factory('ActionFactory', ['$rootScope', function($rootScope) {
    let action = {};
    let states = {}; // these generate as the state is used for first time.

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

    action.runEvents = (state) => {
        action.stopEvents();
        setTimeout(() => {states[state] = true;}, 0)
    }

    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options) {
            action.stopEvents('nav');
            action.stopEvents(fromState.name);
        })

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            action.runEvents(toState.name);
        });

    action.isActive = (state) => {
        return states[state];
    }


    return action;


}]);
