core.controller('SidebarCtrl', function($scope, $state, $rootScope, $mdSidenav, SidebarFactory, TimerFactory) {
    //$scope.sidebarOpen = true;
    $scope.openSidebar = () => {
        $mdSidenav('left').open()
        $scope.sidebarOpen = true;
    }

    $scope.closeSidebar = () => {
        $mdSidenav('left').close()
        $scope.sidebarOpen = false;
    }

    $scope.stopWebcam = () => {
    	TimerFactory.clearAll();
    }

});