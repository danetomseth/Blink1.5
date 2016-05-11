//factory used to determine what function to iterate

core.factory('IterateFactory', function($rootScope, TimerFactory, PopupFactory, KeyboardFactory, TrackingFactory, PositionFactory, SidebarFactory) {
    var iterateObj = {};
    var count = 0;
    var debounce = true;
    var selectingLetter = false;
    iterateObj.scopeValue = [];
    iterateObj.linkValue;
    iterateObj.selectedLetter;


    var keyboardIterator = function() {
        if (debounce && !selectingLetter) {
             let arr = [KeyboardFactory.iterateRow(), iterateObj.scopeValue[1]]
             angular.copy(arr, iterateObj.scopeValue);
        } else if (debounce && selectingLetter) {
            iterateObj.scopeValue[1] = KeyboardFactory.iterateLetter();
        }
    }
    var popupIterator = function() {
        if (debounce && !selectingLetter) {
             let arr = [PopupFactory.iterateRow(), iterateObj.scopeValue[1]]
             angular.copy(arr, iterateObj.scopeValue);
        } else if (debounce && selectingLetter) {
            iterateObj.scopeValue[1] = PopupFactory.iterateLetter();
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
    function goToPage() {
        TimerFactory.clearAll();
        SidebarFactory.changeState();
    }

    function analyzePositions(cb) {
        var positions = TrackingFactory.getPositions();
        if (positions) {
            if (PositionFactory.browCompare(positions)) {
            	cb();
            }
        }
    }

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

    

    function popupSelect() {
       iterateObj.selectedLetter = iterateObj.scopeValue[1];
        //check to make sure the selected letter is not undefined
        if (selectingLetter && iterateObj.selectedLetter) {
            iterateObj.word = PopupFactory.selectLetter();
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
            case 'popup': 
                PositionFactory.setBrowZero(positions);
                TimerFactory.startReading(analyzePositions, 50, popupCallback);
                TimerFactory.moveCursor(popupIterator, 750);
        }
    }



    return iterateObj;


});