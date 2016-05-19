core.factory('IterateFactory', function($rootScope, ConstantsFactory, CornersFactory, TimerFactory, PopupFactory, KeyboardFactory, TrackingFactory, SettingsFactory, PositionFactory, SidebarFactory) {
    var trackingActive = false;

    var iterateObj = {};
    var count = 0;
    var debounce = true;
    var boxDebounce = true;
    var mouthDebounce = true;
    var selectingLetter = false;
    var selectingOption = false;
    var currentBox = 0;
    var blinkHold = 0;
    let frameId;
    let callback;
    let stopFrame = false;
    let startDebounce = false;
    iterateObj.scopeValue = [];
    iterateObj.linkValue;
    iterateObj.settingsValue;
    iterateObj.selectedLetter;

    //sets initial box to middle
    iterateObj.selectedBox = 2;
    iterateObj.word = "";

    let startDelay = () => {
        startDebounce = false;
        setTimeout(() => {
            startDebounce = true
        }, 1000)
    }

    let debounceFn = (time, fn) => {
        let t = time || 750
        setTimeout(() => {
            debounce = true
            if (fn) {
                fn()
            };
        }, t)
    }

    let boxDelay = () => {
        setTimeout(() => {
            boxDebounce = true
        }, 1000)
    }

    const translateDelay = {
            0: 1400,
            1: 1200,
            2: 950,
            3: 750,
            4: 600,
            5: 500
        }
        // Set default delay
    let delay = translateDelay[3];

    // If a user is logged in, use their delay preferences
    if ($rootScope.user) {
        delay = translateDelay[$rootScope.user.keyboardSpeed]
    }

    ////////////////////////////////////////////////////////////
    //////////// Iterator Functions sent to Timer
    ////////////////////////////////////////////////////////////

    // Iterator functions to update scope values
    var keyboardIterator = function() {
        if (debounce && !selectingLetter) {
            let arr = KeyboardFactory.iterateRow();
            angular.copy(arr, iterateObj.scopeValue);
            if (iterateObj.scopeValue[0] === 0) {
                TimerFactory.pauseIteration(250);
            }
        } else if (debounce && selectingLetter) {
            if (iterateObj.scopeValue[1] === null) {
                TimerFactory.pauseIteration(250);
            }
            iterateObj.scopeValue[1] = KeyboardFactory.iterateLetter();

            // At the end of the row, go on to the next one
            if (iterateObj.scopeValue[1] === 0) {
                KeyboardFactory.endOfRow();
                iterateObj.scopeValue[1] = null;
                selectingLetter = false;
            }
        }
    }

    var popupIterator = function() {
        if (debounce && !selectingLetter) {
            let arr = PopupFactory.iterateRow()
            angular.copy(arr, iterateObj.scopeValue);
            if (iterateObj.scopeValue[0] === 0) {
                TimerFactory.pauseIteration(500);
            }
        } else if (debounce && selectingLetter) {
            iterateObj.scopeValue[1] = PopupFactory.iterateLetter();
            if (iterateObj.scopeValue[1] === 0) {
                TimerFactory.pauseIteration(500);
            }
        }
    }

    // Iterate functions to update values on scope
    var linkIterator = function() {
        iterateObj.linkValue = SidebarFactory.moveSelected();
    }

    var settingsIterator = function() {
        // Iterate tabs
        if (!selectingOption) {
            iterateObj.scopeValue[0] = SettingsFactory.moveSelected();
            iterateObj.scopeValue[1] = 0;
        }
        // Iterate options
        else if (debounce && selectingOption) {
            iterateObj.scopeValue[1] = SettingsFactory.iterateOption(iterateObj.scopeValue[0]);
        }
    }

    ////////////////////////////////////////////////////////////
    //////////// Analyze functions that accept callbacks
    ////////////////////////////////////////////////////////////

    let lastBlinkTime;
    let blinkDt;

    function analyzeEyePositions(cb) {
        $rootScope.$digest();
        var positions = TrackingFactory.getPositions();
        if (positions && PositionFactory.blinkCompare(positions) && startDebounce) {
            blinkDt = Date.now() - lastBlinkTime;
            // On double blink
            // if ((blinkDt < 500) && (blinkDt > 150)) {
            //     console.log('double blink!!');
            //     iterateObj.word = KeyboardFactory.doubleBlink(selectingLetter);
            // }
            // // Two blinks
            // else {
            //     callback();
            // }
            callback();
            lastBlinkTime = Date.now();
        }
        if (!stopFrame) {
            frameId = window.requestAnimationFrame(analyzeEyePositions);
        }
    }

    function navAction(cb) {
        var positions = TrackingFactory.getPositions();

        if (positions && PositionFactory.blinkCompare(positions)) {
            console.log('triggered');
            if (startDebounce) callback();
        }
        if (!stopFrame) {
            frameId = window.requestAnimationFrame(analyzeEyePositions);
        }
    }

    function analyzeBrowPositions(cb) {
        var positions = TrackingFactory.getPositions();
        if (positions) {
            if (PositionFactory.browCompare(positions)) {
                cb();
            }
        }
    }

    function readPositions() {
        let positions = TrackingFactory.getPositions();
        if (positions) {
            let eyeX = positions[27][0] + positions[32][0]
            let eyeY = positions[27][1] + positions[32][1]
            CornersFactory.eyePosition(eyeX, eyeY); // if the eyes go more than the "threshold" away from center then go to the corner
        }
    }

    ////////////////////////////////////////////////////////////
    /////////// Candidates for an Action Factory?
    ////////////////////////////////////////////////////////////

    // Position Functions
    function goToPage() {
        SidebarFactory.changeState();
    }

    function settingsCallback() {
        // Choosing a tab
        if (!selectingOption) {
            let navbarCheck = SettingsFactory.changeState();
            if (!navbarCheck) { // Still in settings state
                if (debounce) {
                    debounce = false;
                    selectUserOption();
                }
                selectingOption = true;
            } else { // Moving to Nav
                TimerFactory.clearTracking();
                iterateObj.iterate('nav');
            }
        }
        // Choosing a user option
        else {
            if (debounce) {
                debounce = false;
                SettingsFactory.selectOption();
                setTimeout(function() {
                    selectingOption = false;
                    debounce = true;
                }, 750);
            }
        }
    }

    // Tab selector for settings callback
    function selectUserOption() {
        if (selectingOption) {
            iterateObj.scopeValue[1] = SettingsFactory.iterateOption(iterateObj.scopeValue[0]);
        }
        // Options selector for settings callback
        else {
            selectingOption = true;
        }
        setTimeout(function() {
            debounce = true;
        }, 750)
    }

    function popupSelect() {
        iterateObj.selectedLetter = iterateObj.scopeValue[1];
        //check to make sure the selected letter is not undefined
        if (selectingLetter) {
            iterateObj.word = PopupFactory.selectLetter();
            iterateObj.scopeValue[1] = null;
            selectingLetter = false;
        } else {
            iterateObj.scopeValue[1] = PopupFactory.iterateLetter();
            selectingLetter = true;
        }
        debounceFn(null, function() {
            iterateObj.selectedLetter = null;
        })
    }

    // Row/Column selector for keyboard callback
    function selectLetter() {
        if (selectingLetter) {
            iterateObj.selectedLetter = KeyboardFactory.getCurrentLetter();
            iterateObj.word = KeyboardFactory.selectLetter();
            selectingLetter = false;
        } else {
            iterateObj.scopeValue[1] = KeyboardFactory.iterateLetter();
            selectingLetter = true;
        }
        debounceFn(null, function() {
            iterateObj.selectedLetter = null;
        })
    }

    ////////////////////////////////////////////////////////////
    //////////// Callback functions to send to analyzers
    ////////////////////////////////////////////////////////////

    // Callback functions for analyzePositions
    function keyboardCallback() {
        if (debounce) {
            debounce = false;
            selectLetter();
        }
    }

    function popupCallback() {
        if (debounce) {
            debounce = false;
            popupSelect();
        }
    }

    function navCallback() {
        iterateObj.linkValue = null;
        stopFrame = true;
        TimerFactory.clearAll();
        goToPage();
    }


    ////////////////////////////////////////////////////////////
    /////////// Corners functions
    ////////////////////////////////////////////////////////////


    let cornersCallback = (box) => {
        if (debounce) {
            debounce = false;
            boxDebounce = false;
            CornersFactory.goToBox(box);
            debounceFn(); // wait to set debounce to true
            boxDelay(); // wait to set boxDebounce back to true
        }
    }

    let cornersSelect = (box) => {
        if (debounce) {
            debounce = false;
            boxDebounce = false;
            CornersFactory.select(box);
            debounceFn(); // wait to set debounce to true
            boxDelay(); // wait to set boxDebounce back to true
            cornersCallback();
        }
    }

    let cornersDelete = () => {
         if (debounce) {
            debounce = false;
            boxDebounce = false;
            CornersFactory.delete();
            debounceFn(); // wait to set debounce to true
            boxDelay(); // wait to set boxDebounce back to true
        }
    }

    var pupilCheck = function(page) {
        var converge = TrackingFactory.convergence();
        var positions = TrackingFactory.getPositions();
        if (converge < 300) {
            count++;
            if (count > 10) {
                PositionFactory.getBlinkAverage(positions);
            }
            if (count > 30) {
                PositionFactory.setPupilZero(positions);
                PositionFactory.setBlinkZero(positions);
                TimerFactory.calibrationFinished();
                iterateObj.iterate('corners');
                count = 0;
            }
        } else {
            count = 0;
        }
    }

    let mainScreen = true;
    let doubleBlink;

    function analyzePupilPositions() {
        $rootScope.$digest();
        let positions = TrackingFactory.getPositions();

        if (positions && startDebounce && boxDebounce) {
            currentBox = PositionFactory.pupilPosition(positions);

            // On blink
            if (PositionFactory.blinkCompare(positions)) {
                blinkDt = Date.now() - lastBlinkTime;
                doubleBlink = ((blinkDt <= 750) && (blinkDt > 250));
                if (mainScreen && !doubleBlink) {
                    // Select a box from the main screen
                    cornersCallback(currentBox);
                    mainScreen = false;
                } else if (mainScreen && doubleBlink) {
                    // Delete on double blink for main screen
                    cornersDelete();
                } else if (blinkDt > 750) {
                    // Single blink to select
                    cornersSelect(currentBox);
                    mainScreen = true;
                } else if ((blinkDt <= 750) && (blinkDt > 250)) {
                    // Double blink goes back to home page
                    cornersCallback();
                    mainScreen = true;
                }
                lastBlinkTime = Date.now();
            }
            // Highlight boxes based on pupil position
            else {
                iterateObj.selectedBox = currentBox;
            }
        }

        // Keep running request animation frame
        if (!stopFrame) {
            frameId = window.requestAnimationFrame(analyzePupilPositions);
        }
    }

    ////////////////////////////////////////////////////////////
    /////////// Zeroing functions
    ////////////////////////////////////////////////////////////

    var convergeCheck = function(page) {
        var converge;
        if ($rootScope.trackerInitialized) {
            converge = TrackingFactory.convergence();
        } else {
            converge = 500;
        }
        if (converge < 300) {
            count++;
            if (count > 10) {
                var positions = TrackingFactory.getPositions();
                PositionFactory.getBlinkAverage(positions);
            }
            if (count > 30) {
                PositionFactory.setBlinkZero(positions);
                TimerFactory.calibrationFinished();
                iterateObj.iterate(page);
                count = 0;
            }
        } else {
            count = 0;
        }
    }

    iterateObj.zero = function(page) {
        if (trackingActive) {
            TimerFactory.clearTracking();
            console.log('Tracking already active!');
        }

        if (!$rootScope.caregiver) {
            trackingActive = true;
            //$rootScope.zeroActive = true;
            if (page === 'corners') {
                TimerFactory.calibrate(pupilCheck, 50, page);
            } else TimerFactory.calibrate(convergeCheck, 50, page);
        } else {
            console.log('Caregiver, everything stopped');
            TimerFactory.clearAll();
        }

    }

    iterateObj.iterate = function(page) { // fires once we have calibration (from browZero())
        startDelay();
        stopFrame = false;
        $rootScope.zeroActive = false;
        var positions = TrackingFactory.getPositions();
        switch (page) {
            case 'nav':
                callback = navCallback;
                TimerFactory.moveCursor(linkIterator, 1000);
                frameId = window.requestAnimationFrame(navAction);
                break;
            case 'type':
                lastBlinkTime = Date.now();
                callback = keyboardCallback;
                //TimerFactory.startReading(analyzeEyePositions, 50, keyboardCallback);
                TimerFactory.moveCursor(keyboardIterator, 750);
                frameId = window.requestAnimationFrame(analyzeEyePositions);
                break;
            case 'corners':
                lastBlinkTime = Date.now();
                callback = cornersCallback;
                frameId = window.requestAnimationFrame(analyzePupilPositions);
                // TimerFactory.startReading(analyzePupilPositions, 50, cornersCallback);
                break;
            case 'popup':
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(analyzeBrowPositions, 50, popupCallback);
                TimerFactory.moveCursor(popupIterator, delay);
                break;
            case 'settings':
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(analyzeBrowPositions, 50, settingsCallback);
                TimerFactory.moveCursor(settingsIterator, 1500);
                break;
        }
    }
    return iterateObj;
});
