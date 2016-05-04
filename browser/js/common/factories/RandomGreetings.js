app.factory('RandomGreetings', function () {

    var getRandomFromArray = function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    var greetings = [
        'Hello, world!',
        'At long last, I live!',
        'Hello, simple human.',
        'What a beautiful day!',
        'I\'m like any other project, except that I am yours. :)',
        'This empty string is for Lindsay Levine.',
        'こんにちは、ユーザー様。',
        'Welcome. To. WEBSITE.',
        ':D',
        'Yes, I think we\'ve met before.',
        'Gimme 3 mins... I just grabbed this really dope frittata',
        'If Cooper could offer only one piece of advice, it would be to nevSQUIRREL!',
    ];

    return {
        greetings: greetings,
        getRandomGreeting: function () {
            return getRandomFromArray(greetings);
        }
    };

});
