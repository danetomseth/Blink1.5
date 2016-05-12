'use strict';
const core = angular.module('core', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngMaterial'])

window.app = angular.module('BlinkApp', ['blinkAuth', 'core']);


core.config(function($mdThemingProvider) {
    var customPrimary = {
        '50': '#586687',
        '100': '#4e5b78',
        '200': '#444f68',
        '300': '#3a4359',
        '400': '#303849',
        '500': '#262c3a',
        '600': '#1c202b',
        '700': '#12151b',
        '800': '#08090c',
        '900': '#000000',
        'A100': '#637296',
        'A200': '#717fa2',
        'A400': '#808dac',
        'A700': '#000000'
    };
    $mdThemingProvider
        .definePalette('customPrimary',
            customPrimary);

    var customAccent = {
        '50': '#004442',
        '100': '#005d5b',
        '200': '#007774',
        '300': '#00908d',
        '400': '#00aaa6',
        '500': '#00c3bf',
        '600': '#00f6f1',
        '700': '#11fffa',
        '800': '#2afffa',
        '900': '#44fffb',
        'A100': '#00f6f1',
        'A200': '#00DDD8',
        'A400': '#00c3bf',
        'A700': '#5dfffb'
    };
    $mdThemingProvider
        .definePalette('customAccent',
            customAccent);
        //redish color
    var customWarn = {
        '50': '#ffdfe2',
        '100': '#ffc6cb',
        '200': '#ffacb4',
        '300': '#ff939c',
        '400': '#ff7985',
        '500': '#FF606E',
        '600': '#ff4657',
        '700': '#ff2d3f',
        '800': '#ff1328',
        '900': '#f90016',
        'A100': '#fff9fa',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#df0014'
    };
    $mdThemingProvider
        .definePalette('customWarn',
            customWarn);

     var customBackground = {
        '50': '#ffffff',
        '100': '#ffffff',
        '200': '#f9f9f9',
        '300': '#ececec',
        '400': '#e0e0e0',
        '500': '#D3D3D3',
        '600': '#c6c6c6',
        '700': '#b9b9b9',
        '800': '#adadad',
        '900': '#a0a0a0',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#939393'
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
