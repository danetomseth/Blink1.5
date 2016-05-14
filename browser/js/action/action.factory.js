'use strict';

core.factory("ActionFactory", function(){
    return {
        actOn: (action) => {
            switch (action){
                case 'space':
                    return predictWords();
                case 'Speak':
                    SpeechFactory.say(word);
                    break;
                default:
                    console.log("Error: Action "+action+" not found");
            }
        }
    }
});
