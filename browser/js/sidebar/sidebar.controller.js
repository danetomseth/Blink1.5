core.controller('SidebarCtrl', function($scope, $state, $rootScope, $mdSidenav, SidebarFactory) {
    let sidebarReady = false;
    $scope.toggleSidebar = () => {
        $mdSidenav('left')
            .toggle()
            .then(() => {
            	console.log('toggled');
            });
    }

});