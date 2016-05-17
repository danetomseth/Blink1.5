core.config(function($stateProvider) {
    $stateProvider.state('settings', {
        url: '/settings',
        controller: 'SettingsCtrl',
        templateUrl: 'templates/settings.html',
        onEnter: function(IterateFactory) {
            IterateFactory.zero('settings');
        },
        resolve: {
            user: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
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
