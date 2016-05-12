'use strict';
const core = angular.module('core', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngMaterial'])

window.app = angular.module('BlinkApp', ['blinkAuth', 'core']);


core.config(function($mdThemingProvider) {
    //angular material icons
    
     
 var customPrimary = {
        '50': '#d8eff3',
        '100': '#c4e8ec',
        '200': '#b1e0e6',
        '300': '#9ed8e0',
        '400': '#8ad1da',
        '500': '#77c9d4',
        '600': '#64c1ce',
        '700': '#50bac8',
        '800': '#3db2c1',
        '900': '#37a0ae',
        'A100': '#ebf7f9',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#318e9b'
    };
    $mdThemingProvider
        .definePalette('customPrimary', 
                        customPrimary);

    var customAccent = {
        '50': '#235941',
        '100': '#2a6b4f',
        '200': '#327d5c',
        '300': '#39906a',
        '400': '#40a277',
        '500': '#47b485',
        '600': '#6ac49d',
        '700': '#7dcba9',
        '800': '#8fd3b5',
        '900': '#a1dac1',
        'A100': '#6ac49d',
        'A200': '#58bd91',
        'A400': '#47b485',
        'A700': '#b3e1cd'
    };
    $mdThemingProvider
        .definePalette('customAccent', 
                        customAccent);

    var customWarn = {
        '50': '#05cdbe',
        '100': '#04b5a7',
        '200': '#049c90',
        '300': '#038379',
        '400': '#036a62',
        '500': '#02514b',
        '600': '#013834',
        '700': '#011f1d',
        '800': '#000606',
        '900': '#000000',
        'A100': '#06e6d5',
        'A200': '#0cf9e7',
        'A400': '#25faea',
        'A700': '#000000'
    };
    $mdThemingProvider
        .definePalette('customWarn', 
                        customWarn);

    var customBackground = {
        '50': '#e8e8eb',
        '100': '#dbdbdf',
        '200': '#cdcdd3',
        '300': '#c0c0c7',
        '400': '#b2b2bb',
        '500': '#a5a5af',
        '600': '#9797a3',
        '700': '#8a8a97',
        '800': '#7c7c8b',
        '900': '#70707e',
        'A100': '#f6f6f7',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#646470'
    };
    $mdThemingProvider
        .definePalette('customBackground', 
                        customBackground);

   $mdThemingProvider.theme('default')
       .primaryPalette('customPrimary')
       .accentPalette('customAccent')
       .warnPalette('customWarn')
       .backgroundPalette('customBackground')
});

app.config(function($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function() {
        window.location.reload();
    });
});




// This app.run is for controlling access to specific states.
app.run(function($rootScope, AuthService, $state, TrackingFactory, WebcamFactory, TimerFactory) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function(state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

        TimerFactory.clearTracking();
        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function(user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });

    });

});