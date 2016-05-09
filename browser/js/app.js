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
        '200': '#ffffff',
        '300': '#ffffff',
        '400': '#ffffff',
        '500': '#FFFFFF',
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
app.run(function($rootScope, AuthService, $state, TrackingFactory, WebcamFactory, $mdSidenav) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function(state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

        if(toState.name !== 'home') {
            console.log('not home');
            $mdSidenav('left').open();
            $rootScope.sidebarActive = true;
        }

        if ($rootScope.videoActive) {
            $rootScope.videoActive = false;
            TrackingFactory.endTracking();
            WebcamFactory.endWebcam();
            clearInterval($rootScope.cursorInterval);
            clearInterval($rootScope.calibrateInterval);
            clearInterval($rootScope.intervalRead);
            clearInterval($rootScope.readPositionInt);
            clearInterval($rootScope.cursorInterval);
            clearInterval($rootScope.calibrateInterval);
            clearInterval($rootScope.videoInterval);
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