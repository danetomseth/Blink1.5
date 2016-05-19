core.factory('IterateFactory', function(TimerFactory, PopupFactory) {

    let iterateObj = {};



    ////////////////////////////////////////////////////////////
    /////////// PENDING DELETE
    ////////////////////////////////////////////////////////////




    function popupSelect() {
        iterateObj.selectedLetter = iterateObj.scopeValue[1];
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

    function popupCallback() {
        if (debounce) {
            debounce = false;
            popupSelect();
        }
    }

    let popupIterator = function() {
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
    return iterateObj;
});
