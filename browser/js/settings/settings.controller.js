core.config(function($stateProvider) {
    $stateProvider.state('settings', {
        url: '/settings',
        controller: 'SettingsCtrl',
        templateUrl: 'templates/settings.html'
    });
});

core.controller('SettingsCtrl', function($scope, $mdSidenav) {
    
});