// this controls the links for assisted navigation
core.controller('LinkCtrl', function($scope, $state, $mdSidenav) {
	$scope.hideSidebar = () => {
		$mdSidenav('left').toggle();
		console.log('toggle');
	}
});
