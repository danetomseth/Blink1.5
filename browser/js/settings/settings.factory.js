core.factory('SettingsFactory', function($http) {
 return {
    editSettings: (obj, user) => {
        return $http.put('/api/users/' + user._id, obj)
        .then((updatedUser) => updatedUser)
    }
 }
});
