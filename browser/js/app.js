'use strict';
const core = angular.module('core', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngMaterial'])

window.app = angular.module('BlinkApp', ['blinkAuth', 'core']);


//core.config(function($mdThemingProvider) {
    //angular material icons
// var customPrimary = {
//         '50': '#a9c6e8',
//         '100': '#95b9e3',
//         '200': '#81acde',
//         '300': '#6c9fd9',
//         '400': '#5891d3',
//         '500': '#4484ce',
//         '600': '#3477c5',
//         '700': '#2e6bb1',
//         '800': '#295f9c',
//         '900': '#245288',
//         'A100': '#bdd4ee',
//         'A200': '#d1e1f3',
//         'A400': '#e6eef8',
//         'A700': '#1e4674'
//     };
//     $mdThemingProvider
//         .definePalette('customPrimary',
//                         customPrimary);

//     var customAccent = {
//         '50': '#605000',
//         '100': '#796500',
//         '200': '#937a00',
//         '300': '#ac8f00',
//         '400': '#c6a500',
//         '500': '#dfba00',
//         '600': '#ffd713',
//         '700': '#ffdc2d',
//         '800': '#ffe046',
//         '900': '#ffe460',
//         'A100': '#ffd713',
//         'A200': '#f9cf00',
//         'A400': '#dfba00',
//         'A700': '#ffe879'
//     };
//     $mdThemingProvider
//         .definePalette('customAccent',
//                         customAccent);

//     var customWarn = {
//         '50': '#fadfc3',
//         '100': '#f8d2ac',
//         '200': '#f7c594',
//         '300': '#f5b87c',
//         '400': '#f3ac65',
//         '500': '#f19f4d',
//         '600': '#ef9235',
//         '700': '#ed851e',
//         '800': '#e07912',
//         '900': '#c86c10',
//         'A100': '#fcebdb',
//         'A200': '#fef8f2',
//         'A400': '#ffffff',
//         'A700': '#b15f0e'
//     };
//     $mdThemingProvider
//         .definePalette('customWarn',
//                         customWarn);

//     var customBackground = {
//         '50': '#ffffff',
//         '100': '#ffffff',
//         '200': '#ffffff',
//         '300': '#f2f2f2',
//         '400': '#e6e6e6',
//         '500': '#d9d9d9',
//         '600': '#cccccc',
//         '700': '#bfbfbf',
//         '800': '#b3b3b3',
//         '900': '#a6a6a6',
//         'A100': '#ffffff',
//         'A200': '#ffffff',
//         'A400': '#ffffff',
//         'A700': '#999999'
//     };
//     $mdThemingProvider
//         .definePalette('customBackground',
//                         customBackground);

//    $mdThemingProvider.theme('default')
//        .primaryPalette('customPrimary')
//        .accentPalette('customAccent')
//        .warnPalette('customWarn')
//        .backgroundPalette('customBackground')
// });

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
app.run(function($rootScope, AuthService, $state) {
     //initially sets caregiver to false
    $rootScope.caregiver = false;
    // The given state requires an authenticated user.
    AuthService.getLoggedInUser().then(function(user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                let threshold = {
                    ratio: user.blinkRatio,
                    zero: user.blinkZero
                }
                $rootScope.$emit("userThreshold", threshold);
            } else {
                console.log('no user!!');
            }
        });
    var destinationStateRequiresAuth = function(state) {
        return state.data && state.data.authenticate;
    };


    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {


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
