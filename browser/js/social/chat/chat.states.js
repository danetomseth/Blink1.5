core.config(function($stateProvider){
    $stateProvider.state('chat', {
        url: '/chat',
        templateUrl: 'templates/chat.html',
        controller: "ChatCtrl",
        resolve: {
            user: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    })
});
