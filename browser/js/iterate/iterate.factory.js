//factory used to determine what function to iterate

core.factory('IterateFactory', function($rootScope, TimerFactory, KeyboardFactory, TrackingFactory, SettingsFactory, PositionFactory, SidebarFactory) {
    var iterateObj = {};
    var count = 0;
    var debounce = true;
    var selectingLetter = false;
    iterateObj.scopeValue = [];
    iterateObj.linkValue;
    iterateObj.settingsValue;
    iterateObj.selectedLetter;

    // Iterator functions to update scope values
    var keyboardIterator = function() {
        if (debounce && !selectingLetter) {
            let arr = [KeyboardFactory.iterateRow(), iterateObj.scopeValue[1]]
            angular.copy(arr, iterateObj.scopeValue);
        } else if (debounce && selectingLetter) {
            iterateObj.scopeValue[1] = KeyboardFactory.iterateLetter();
        }
    }

    var linkIterator = function() {
        iterateObj.linkValue = SidebarFactory.moveSelected();
    }

    var settingsIterator = function() {
        iterateObj.settingsValue = SettingsFactory.moveSelected();
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

    function navCallback() {
        TimerFactory.clearTracking();
        iterateObj.scopeValue[0] = null;
        TimerFactory.clearAll();
        SidebarFactory.changeState();
        // goToPage();
    }

    function settingsCallback() {
        TimerFactory.clearTracking();
        TimerFactory.clearAll();
        SettingsFactory.changeState();
    }

    // State Change clears timers
    // function goToPage() {
    //     TimerFactory.clearAll();
    //     SidebarFactory.changeState();
    // }

    // Function used in keyboardCallback
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
        setTimeout(function() {
            iterateObj.selectedLetter = '';
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
            case 'scroll':
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(analyzePositions, 50, keyboardCallback);
                TimerFactory.moveCursor(keyboardIterator, 750);
                break;
            case 'settings':
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(analyzePositions, 50, settingsCallback);
                TimerFactory.moveCursor(settingsIterator, 1200);
                break;
        }
    }

    return iterateObj;
});
