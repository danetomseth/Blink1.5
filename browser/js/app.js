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
        '500': '#77C9D4',
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
        '50': '#f31100',
        '100': '#ff1e0d',
        '200': '#ff3627',
        '300': '#ff4e40',
        '400': '#ff665a',
        '500': '#ff7d73',
        '600': '#ffada6',
        '700': '#ffc4c0',
        '800': '#ffdcd9',
        '900': '#fff4f3',
        'A100': '#ffada6',
        'A200': '#FF958D',
        'A400': '#ff7d73',
        'A700': '#ffffff'
    };
    $mdThemingProvider
        .definePalette('customAccent', 
                        customAccent);

    var customWarn = {
        '50': '#ffffff',
        '100': '#fffbf3',
        '200': '#fff3d9',
        '300': '#ffebc0',
        '400': '#ffe3a6',
        '500': '#FFDB8D',
        '600': '#ffd373',
        '700': '#ffcb5a',
        '800': '#ffc340',
        '900': '#ffbb27',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#ffb30d'
    };
    $mdThemingProvider
        .definePalette('customWarn', 
                        customWarn);

    var customBackground = {
        '50': '#ffffff',
        '100': '#ffffff',
        '200': '#ffffff',
        '300': '#ffffff',
        '400': '#ffffff',
        '500': '#FFF',
        '600': '#f2f2f2',
        '700': '#e6e6e6',
        '800': '#d9d9d9',
        '900': '#cccccc',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#bfbfbf'
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
        if ((toState.name !== "settings.features") && (toState.name !== "settings.keyboard")) {
            TimerFactory.clearTracking();
        }

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
