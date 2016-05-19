//this sets all of timer dependent functions to the same intervals to clear on state change

core.factory('TimerRAFFactory', function($rootScope, $state, PositionFactory, TrackingFactory) {

    let rafFrame
    let startTime = 0;
    let iterationTime = 1000 // updated on state change
    let weNeedToCheckEyePosition = false;
    let lastBox;


    // Run a RAF Step

    function loop (timestamp){

        // Always draw the face on the tracker
        TrackingFactory.drawLoop();

        // Always check if we should iterate
        if (timestamp - startTime > iterationTime){
            // console.log("broadcasting iterate at time:", timestamp-startTime)
            $rootScope.$broadcast("iterate")
            startTime = timestamp
        }



        let positions = TrackingFactory.getPositions();
        // Only run theses if we are tracking properly
        if (positions) {

            // Check for blink
            let blink = PositionFactory.blinkCompare(positions)
            if(blink){
                // console.log("broadcasting", blink)
                $rootScope.$broadcast(blink) // broadcasts "doubleBlink" or "singleBlink"
            }

            // Check for eye positions
            if(weNeedToCheckEyePosition){
                let currentBox = PositionFactory.pupilPosition(positions);
                //broadcast only on box change
                if (lastBox !== currentBox){
                    // console.log("broadcasting box", currentBox)
                    $rootScope.$broadcast(currentBox); // broadcasts the box the user is currently looking at
                }
                lastBox = currentBox;
            }


            // Check for brow

            // Check for mouth


        }


        // loop again
        requestAnimationFrame(loop);
    }

    return {
        start: loop
    }

});
