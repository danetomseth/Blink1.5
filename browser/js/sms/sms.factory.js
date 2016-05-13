core.factory("SMSFactory", function($http) {

 return {
    sendText: (sms) => {
        return $http.post('/api/sms', {
            to: sms.to,
            message: sms.message
        });
    }
 }

})
