core.config(function($stateProvider){
    $stateProvider.state('chat', {
        url: '/chat',
        templateUrl: 'templates/chat.html',
        controller: "ChatCtrl",
        resolve: {
            user: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
        },
        onEnter: function(ActionFactory, TypeFactory) {
            let socket = io();
            ActionFactory.runEvents('type');
            TypeFactory.setSpecialFunction({
                text: "POST",
                function: function(){
                    return socket.emit('chat', TypeFactory.word)
                }
            })
        }
    })
});
