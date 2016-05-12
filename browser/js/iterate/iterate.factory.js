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
             let arr = KeyboardFactory.iterateRow();
             angular.copy(arr, iterateObj.scopeValue);
             if(iterateObj.scopeValue[0] === 0) {
                TimerFactory.pauseIteration(500);
             }
        } else if (debounce && selectingLetter) {
            iterateObj.scopeValue[1] = KeyboardFactory.iterateLetter();
            if(iterateObj.scopeValue[1] === 0) {
                TimerFactory.pauseIteration(500);
             }
        }
    }

    var popupIterator = function() {
        if (debounce && !selectingLetter) {
             let arr = PopupFactory.iterateRow()
             angular.copy(arr, iterateObj.scopeValue);
             if(iterateObj.scopeValue[0] === 0) {
                TimerFactory.pauseIteration(500);
             }
        } else if (debounce && selectingLetter) {
            iterateObj.scopeValue[1] = PopupFactory.iterateLetter();
            if(iterateObj.scopeValue[1] === 0) {
                TimerFactory.pauseIteration(500);
             }
        }
        console.log(iterateObj.scopeValue);
    }

    // Iterate functions to update values on scope
    var linkIterator = function() {
        iterateObj.linkValue = SidebarFactory.moveSelected();
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
    }

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