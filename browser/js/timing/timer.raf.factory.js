//this sets all of timer dependent functions to the same intervals to clear on state change

core.factory('TimerRAFFactory', function($rootScope, Session, $state, PositionFactory, TrackingFactory, ActionFactory) {

    const translateDelay = {
        0: 1400,
        1: 1200,
        2: 950,
        3: 750,
        4: 600,
        5: 500
    }
    let iterationTime = (Session.user) ? translateDelay(Session.user.keyboardSpeed) : 750;
    // let rafFrame;
    let startTime = 0;
    // let iterationTime = translateDelay(Session.user.keyboardSpeed) || 750 // updated on state change
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
            let blink = PositionFactory.blinkCompare(positions)
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
