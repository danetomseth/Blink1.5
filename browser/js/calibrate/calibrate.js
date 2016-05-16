core.directive("blCalibrate", function(PositionFactory, TrackingFactory, $interval) {
	return {
		restrict: "E",
		templateUrl: 'templates/calibrate.html',
		link: function(scope, elem, attr) {
			
			let blinkCalibrate;


			let calBlink = () => {
				let i = 1;
				scope.display = "Keep Eyes Open";
				blinkCalibrate = $interval(function() {
					let positions = TrackingFactory.getPositions();
					scope.count = i;
					if(i < 10) {
						PositionFactory.getBlinkAverage(positions);
					}
					if(i === 10) {
						scope.openZero = PositionFactory.setBlinkZero();
						scope.display = "Close Eyes"
					}
					if(i < 22 && i > 12) {
						PositionFactory.getBlinkAverage(positions);
						scope.display = "Close Eyes";
					}
					if(i === 22) {
						scope.closedZero = PositionFactory.setBlinkZero();
						
					}
					if(i > 22) {
						scope.display = "finished"
						scope.calFactor = (scope.closedZero / scope.openZero);
						$interval.clear(blinkCalibrate)
						i = 0;
					}
					i++
				}, 500);
			}
            

            // Fill with gradient
            
			scope.takeReading = function() {
				calBlink();

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