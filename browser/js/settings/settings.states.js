core.config(function($stateProvider) {
    $stateProvider.state('settings', {
        url: '/settings',
        controller: 'SettingsCtrl',
        templateUrl: 'templates/settings.html',
        resolve: {
            user: function(AuthService) {
                AuthService.getLoggedInUser()
                    .then((user) => user);
            }
        },
        onEnter: function(IterateFactory) {
            IterateFactory.zero('settings');
        }
    });

    $stateProvider.state('settings.keyboard', {
        url: '/',
        templateUrl: 'templates/settings.keyboard.html'
    })

    $stateProvider.state('settings.features', {
        url: '/',
        templateUrl: 'templates/settings.features.html'
    })
});
