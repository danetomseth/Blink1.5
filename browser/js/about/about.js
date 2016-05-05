app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'templates/about.html'
    });

});

app.controller('AboutController', function ($scope) {


});
