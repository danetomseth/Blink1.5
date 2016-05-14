app.directive('blLoading', function(){
	return {
        restrict: 'E',
        controller: 'MainCtrl',
        templateUrl: 'templates/loading.html',
        link: function(scope) {
        }
    }
})