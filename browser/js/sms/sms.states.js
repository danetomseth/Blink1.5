core.config(function($stateProvider) {
    $stateProvider.state('sms', {
        url: '/sms',
        templateUrl: 'templates/sms.html',
        controller: (SMSFactory, $scope) => {
            $scope.text = {to: "+18182356602"};

            $scope.send = () => {
                console.log("IM SENDING")
                SMSFactory.sendText($scope.text)
                    .then(() => console.log("Sent!"));
            }
        }
    });
});
