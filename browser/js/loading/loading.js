app.directive('blLoading', function($interval){
	return {
        restrict: 'E',
        controller: 'MainCtrl',
        templateUrl: 'templates/loading.html',
        link: function(scope) {

        	let text = ["Calibrating", "Look Here", "Stay Still", "Calibrating"];
        	let textInt;

        	// let textIterator = function() {
        	// 		scope.loadingText = text[i];
        	// 		i++;
        	// 		if(i >= text.length) {
        	// 			$interval.cancel(textInt);
        	// 		}
        	// 	}

        	function changeText() {
        		let i = 0;
        		textInt = $interval(function() {
        			scope.loadingText = text[i];
        			i++;
        			if(i >= text.length) {
        				$interval.cancel(textInt);
        			}
        		}, 1000);
        	}

        	changeText();
        }
    }
})
