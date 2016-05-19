//this sets all of timer dependent functions to the same intervals to clear on state change

core.factory('TimerRAFFactory', function($rootScope, $state, PositionFactory, TrackingFactory, ActionFactory) {

    let rafFrame
    let startTime = 0;
    let iterationTime = 1000 // updated on state change
    let lastBox;


    // Run a RAF Step

    function loop (timestamp){

        // Always draw the face on the tracker
        TrackingFactory.drawLoop();

        // Always check if we should iterate
        if (timestamp - startTime > iterationTime){
            // console.log("emiting iterate at time:", timestamp-startTime)
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
                // console.log("emiting", blink)
                startTime = timestamp;
                $rootScope.$emit(blink) // emits "doubleBlink" or "singleBlink"
            }

            // Check for eye positions
            if(ActionFactory.isActive('corners')){
                let currentBox = PositionFactory.pupilPosition(positions);
                //emit only on box change
                if (lastBox !== currentBox){
                    console.log("emiting box", currentBox)
                    $rootScope.$emit("changeBox", currentBox); // emits the box the user is currently looking at
                }
                lastBox = currentBox;
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
