//factory used to determine what function to iterate

core.factory('IterateFactory', function($rootScope, TimerFactory, KeyboardFactory, TrackingFactory, PositionFactory, SidebarFactory, CornersFactory) {
    var iterateObj = {};
    var count = 0;
    var debounce = true;
    var selectingLetter = false;
    iterateObj.scopeValue = [];
    iterateObj.linkValue;
    iterateObj.selectedLetter;

    let debounceFn = (time, fn) => {
        let t = time || 750
        setTimeout(() => {
            debounce = true
            if(fn) {fn()};
        }, t)
    }


    var keyboardIterator = function() {
        if (debounce && !selectingLetter) {
             let arr = [KeyboardFactory.iterateRow(), iterateObj.scopeValue[1]]
             angular.copy(arr, iterateObj.scopeValue);
        } else if (debounce && selectingLetter) {
            iterateObj.scopeValue[1] = KeyboardFactory.iterateLetter();
        }
    }

    // Iterate functions to update values on scope
    var linkIterator = function() {
        iterateObj.linkValue = SidebarFactory.moveSelected();
    }



    // Zero functions
    var browZero = function(page) {
            var converge = TrackingFactory.convergence();
            if (converge < 300) {
                count++;
                if (count > 20) {
                    TimerFactory.calibrationFinished();
                    iterateObj.iterate(page);
                }
            } else {
                count = 0;
            }
        }
    // Position Functions

    function analyzePositions(cb) {
        var positions = TrackingFactory.getPositions();
        if (positions) {
            if (PositionFactory.browCompare(positions)) {
            	cb();
            }
        }
    }

////////////////////////////////////////////////////////////
//////////// Callback functions to send to Timer
////////////////////////////////////////////////////////////

    function keyboardCallback() {
        if (debounce) {
            debounce = false;
            selectLetter();
        }
    }

    function navCallback() {
        TimerFactory.clearTracking();
        iterateObj.scopeValue[0] = null;
        goToPage();
    }

    let cornersCallback = () => {
        if (debounce) {
            debounce = false;
            CornersFactory.goToBox()
            debounceFn()
        }
    }

////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
/////////// Candidates for an Action Factory?
////////////////////////////////////////////////////////////

    function goToPage() {
        TimerFactory.clearAll();
        SidebarFactory.changeState();
    }

    function selectLetter() {
       iterateObj.selectedLetter = iterateObj.scopeValue[1];
       	//check to make sure the selected letter is not undefined
        if (selectingLetter && iterateObj.selectedLetter) {
            iterateObj.word = KeyboardFactory.selectLetter();
            iterateObj.scopeValue[1] = "";
            selectingLetter = false;
        } else {
            selectingLetter = true;
        }
        debounceFn(null, function(){
            iterateObj.selectedLetter = '';
        })
    }

    function readPositions() {
        let positions = TrackingFactory.getPositions();
        if (positions) {
            // CornersFactory.selectBox(4); // default to the center box on every run
            let eyeX = positions[27][0] //+ positions[32][0]
            let eyeY = positions[27][1] //+ positions[32][1]
            //scope.eyeSocketX = positions[23][0] //+ positions[30][0]
            //scope.eyeSocketY = positions[23][1] //+ positions[30][1]
            // scope.rightOfEyes = positions[27][1] + positions[32][1]
            CornersFactory.eyePosition(eyeX, eyeY); // if the eyes go more than the "threshold" away from center then go to the corner
        }
    }


////////////////////////////////////////////////////////////



    iterateObj.zero = function(page) {
        TimerFactory.calibrate(browZero, 50, page);
    }


    iterateObj.iterate = function(page) { // fires once we have calibration (from browZero())
        var positions = TrackingFactory.getPositions();
        switch (page) {
            case 'nav':
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(analyzePositions, 50, navCallback);
                TimerFactory.moveCursor(linkIterator, 1000);
                break;
            case 'scroll':
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(analyzePositions, 50, keyboardCallback);
                TimerFactory.moveCursor(keyboardIterator, 750);
                break;
            case 'corners':
                console.log("IN CORNERS")
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(analyzePositions, 50, cornersCallback)
                TimerFactory.startReading(readPositions, 50)
                break;
        }
    }



    return iterateObj;


});
