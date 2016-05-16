core.directive("blCalibrate", function(PositionFactory, TrackingFactory) {
	return {
		restrict: "E",
		templateUrl: 'templates/calibrate.html',
		link: function(scope, elem, attr) {
			scope.takeReading = function() {
				let positions = TrackingFactory.getPositions();
				//console.log(positions);
				scope.diff = PositionFactory.getBlinkAverage(positions);
			}

			scope.takeZero = function() {
				//console.log(positions);
				scope.zero = PositionFactory.setBlinkZero();
			}

			scope.takeDiff = function() {
				let positions = TrackingFactory.getPositions();
				//console.log(positions);
				scope.change = PositionFactory.blinkCompare(positions);
			}

			//scope.setZero
		}
	}
});