'use strict'

core.factory('SpeechFactory', function(){

    return {
        say: (sentence) => {
            responsiveVoice.speak(sentence, 'UK English Male')
        }
    }
})
