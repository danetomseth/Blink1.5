//this sets all of timer dependent functions to the same intervals to clear on state change

core.factory('TimerFactory', function($rootScope, Session, $state, PositionFactory, TrackingFactory, ActionFactory, ConstantsFactory) {

    const translateDelay = {
        0: 1400,
        1: 1200,
        2: 950,
        3: 750,
        4: 600,
        5: 500
    }
    let iterationTime = (Session.user) ? translateDelay(Session.user.keyboardSpeed) : 750;
    let startTime = 0;
    let lastBox;
    let boxDebounce = true


    let boxDelay = () => {
        boxDebounce = false;
        setTimeout(() => {
            boxDebounce = true;
        }, 300);
    }

    // Run a RAF Step

    function loop (timestamp){

        // Always draw the face on the tracker
        TrackingFactory.drawLoop();

        // Always check if we should iterate
        if (timestamp - startTime > iterationTime){
            $rootScope.$emit("iterate")
            startTime = timestamp
        }

        let positions = TrackingFactory.getPositions();
        // Only run theses if we are tracking properly
        if (positions) {
            $rootScope.$digest();

            // Check for blink
            let blink = PositionFactory.blinkCompare(positions);

            // if(ActionFactory.home) {
            //     let eyeValues = PositionFactory.getBlinkValue(positions);
            //     $rootScope.$broadcast('calibrate', eyeValues);
            // }

            if(blink){
                startTime = timestamp;
                $rootScope.$emit(blink) // emits "doubleBlink" or "singleBlink"
            }

            // Check for eye positions
            if(ActionFactory.isActive('corners') && ConstantsFactory.pupilsCalibrated){
                let currentBox = PositionFactory.pupilPosition(positions);
                //emit only on box change
                if (boxDebounce){
                    $rootScope.$emit("changeBox", currentBox); // emits the box the user is currently looking at
                    boxDelay();
                }
            }

            // Check for brow

            // Check for mouth

        }


        // loop again
        requestAnimationFrame(loop);
    };


    return {
        start: loop,
    }

});
