core.controller('ChatCtrl', function($scope, Session){
    let user = Session.user;
    let socket = io();
    $scope.users = [];
    console.log("chat user", user)
    $scope.name = user.firstName + " " + user.lastName[0] + ".";

    $scope.chats = [];

    $scope.chat = [];
    $scope.message = "";

    socket.emit('join', $scope.name)

    $scope.send = () => {
        console.log("sending", $scope.message)
        socket.emit('chat', $scope.message);
        $scope.message = "";
    }

    socket.on('chat', function(msg){
        $scope.chat.push(msg)
    })

    socket.on('updateUsers', function(newUser){
        console.log("new user list", newUser)
        $scope.users=newUser
        // users[newUser.name] = newUser.socket
        console.log("user list", $scope.users)
        $scope.$update
    })


});
