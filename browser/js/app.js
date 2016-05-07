'use strict';
const core = angular.module('core', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngMaterial'])

window.app = angular.module('BlinkApp', ['blinkAuth', 'core']);


core.config(function($mdThemingProvider) {
    var customPrimary = {
        '50': '#ffffff',
        '100': '#ffffff',
        '200': '#ffffff',
        '300': '#fafef3',
        '400': '#effdda',
        '500': '#E5FCC2',
        '600': '#dbfbaa',
        '700': '#d0fa91',
        '800': '#c6f879',
        '900': '#bcf761',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#b1f648'
    };
    $mdThemingProvider
        .definePalette('customPrimary',
            customPrimary);

    var customAccent = {
        '50': '#37ad53',
        '100': '#3dc15c',
        '200': '#4fc76c',
        '300': '#63ce7c',
        '400': '#76d48d',
        '500': '#8ada9d',
        '600': '#b0e6bd',
        '700': '#c4eccd',
        '800': '#d7f2de',
        '900': '#eaf9ee',
        'A100': '#b0e6bd',
        'A200': '#9DE0AD',
        'A400': '#8ada9d',
        'A700': '#fefffe'
    };
    $mdThemingProvider
        .definePalette('customAccent',
            customAccent);

    var customWarn = {
        '50': '#9bd7d4',
        '100': '#88d0cc',
        '200': '#76c8c4',
        '300': '#64c1bd',
        '400': '#52bab5',
        '500': '#45ADA8',
        '600': '#3e9b96',
        '700': '#368985',
        '800': '#2f7673',
        '900': '#286461',
        'A100': '#addedc',
        'A200': '#bfe5e4',
        'A400': '#d1edeb',
        'A700': '#21524f'
    };
    $mdThemingProvider
        .definePalette('customWarn',
            customWarn);

    var customBackground = {
        '50': '#5f7a85',
        '100': '#546d77',
        '200': '#4a5f68',
        '300': '#3f5159',
        '400': '#35444a',
        '500': '#2A363B',
        '600': '#1f282c',
        '700': '#151b1d',
        '800': '#0a0d0e',
        '900': '#000000',
        'A100': '#6a8894',
        'A200': '#78949f',
        'A400': '#87a0aa',
        'A700': '#000000'
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
app.run(function($rootScope, AuthService, $state, TrackingFactory, WebcamFactory) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function(state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

        //console.log("to state", toState);
        if ($rootScope.videoActive) {
            $rootScope.videoActive = false;
            TrackingFactory.endTracking();
            WebcamFactory.endWebcam();
            console.log('ended tracking!!');
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