'use strict'

core.factory('SpeechFactory', function($http){

    return {
        say: (sentence) => {
            responsiveVoice.speak(sentence, 'UK English Male')
        }
    }
})
