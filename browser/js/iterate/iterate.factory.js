//factory used to determine what function to iterate

core.factory('IterateFactory', function($rootScope, TimerFactory, PopupFactory, KeyboardFactory, TrackingFactory, SettingsFactory, PositionFactory, SidebarFactory) {
    var iterateObj = {};
    var count = 0;
    var debounce = true;
    var selectingLetter = false;
    var selectingOption = false;
    iterateObj.scopeValue = [];
    iterateObj.linkValue;
    iterateObj.settingsValue;
    iterateObj.selectedLetter;

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

    // Iterator functions to update scope values
    var keyboardIterator = function() {
        if (debounce && !selectingLetter) {
            let arr = KeyboardFactory.iterateRow();
            angular.copy(arr, iterateObj.scopeValue);
            if (iterateObj.scopeValue[0] === 0) {
                TimerFactory.pauseIteration(500);
            }
        } else if (debounce && selectingLetter) {
            iterateObj.scopeValue[1] = KeyboardFactory.iterateLetter();
            if (iterateObj.scopeValue[1] === 0) {
                TimerFactory.pauseIteration(500);
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

    //Zero functions
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
    function goToPage() {
        TimerFactory.clearAll();
        SidebarFactory.changeState();
    }

    // Position Functions for keyboard/sidebar use
    function analyzePositions(cb) {
        var positions = TrackingFactory.getPositions();
        if (positions) {
            if (PositionFactory.browCompare(positions)) {
                cb();
            }
        }
    }

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
        TimerFactory.clearTracking();
        iterateObj.scopeValue[0] = null;
        goToPage();
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
                }, 750)
            }
        }
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
        setTimeout(function() {
            iterateObj.selectedLetter = null;
            debounce = true;
        }, 750)
        TimerFactory.clearAll();
        SidebarFactory.changeState();
    }

    // Row/Column selector for keyboard callback
    function selectLetter() {
        //check to make sure the selected letter is not undefined
        if (selectingLetter) {
            iterateObj.selectedLetter = iterateObj.scopeValue[1];
            iterateObj.word = KeyboardFactory.selectLetter();
            iterateObj.scopeValue[1] = null;
            selectingLetter = false;
        } else {
            iterateObj.scopeValue[1] = KeyboardFactory.iterateLetter();
            selectingLetter = true;
        }
        setTimeout(function() {
            iterateObj.selectedLetter = null;
            debounce = true;
        }, 750)
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

    iterateObj.zero = function(page) {
        TimerFactory.calibrate(browZero, 50, page);
    }

    iterateObj.iterate = function(page) {
        var positions = TrackingFactory.getPositions();
        switch (page) {
            case 'nav':
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(analyzePositions, 50, navCallback);
                TimerFactory.moveCursor(linkIterator, 1000);
                break;
            case 'type':
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(analyzePositions, 50, keyboardCallback);
                TimerFactory.moveCursor(keyboardIterator, delay);
                break;
            case 'popup':
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(analyzePositions, 50, popupCallback);
                TimerFactory.moveCursor(popupIterator, delay);
            case 'settings':
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(analyzePositions, 50, settingsCallback);
                TimerFactory.moveCursor(settingsIterator, 1500);
                break;
        }
    }
    return iterateObj;
});
