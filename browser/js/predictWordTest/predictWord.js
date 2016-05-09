'use strict';


core.config(function ($stateProvider) {
    $stateProvider.state('predict', {
        url: '/pred',
        controller: 'PredictCtrl',
        templateUrl: 'templates/predictWord.html'
    });
});

core.factory("PredictFactory", function($http){
    let nextWords = (word) => $http.get("/api/words/"+word).then(res => {
        console.log(res.data)
        return res.data
    })

    return {
        nextWords: nextWords
    }
});

core.controller("PredictCtrl", function($scope, PredictFactory){
    $scope.results = []
    $scope.predict = (word) => {
        let w = word || $scope.word
       PredictFactory.nextWords(w)
       .then(words => angular.copy(words, $scope.results))
    }

    $scope.select = (word) => {
        console.log(word)
        $scope.word += " ";
        $scope.word += word;
        $scope.predict(word);
    }

});

