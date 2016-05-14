core.controller('MessageCtrl', function($scope, $q, $timeout, SocialFactory) {
    // $scope.user = $rootScope.user;

    var pendingSearch, cancelSearch = angular.noop;
    var cachedQuery, lastSearch;

    $scope.asyncContacts = [];
    $scope.filterSelected = true;

    $scope.contacts = [];

    /**
     * Search for contacts; use a random delay to simulate a remote call
     */
    $scope.querySearch = (criteria) => {
        cachedQuery = cachedQuery || criteria;
        return cachedQuery ? $scope.allContacts.filter(createFilterFor(cachedQuery)) : [];
    }

    $scope.addContact = (contact) => {
        $scope.contacts.push(contact);
    }

    $scope.removeContact = (contact) => {
        $scope.contacts.splice($scope.contacts.indexOf(contact), 1);
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        console.log(lowercaseQuery)
        return function filterFn(contact) {
            console.log("contact is", contact)
            return (contact._lowername.indexOf(lowercaseQuery) != -1);
        };
    }

    $scope.submitThread = () => {
        let ids = $scope.contacts.map((elem) => elem._id);
        ids.push($scope.user._id);
        return SocialFactory.addPost({
                author: $scope.user._id,
                content: $scope.message,
                type: 'message'
            })
            .then((post) => {
                return SocialFactory.addThread({
                    subject: $scope.subject,
                    participants: ids,
                    messages: post
                })
                .then(() => {
                    console.log("Added Thread/Post")
                })
            })
    }

    $scope.replyToThread = () => {
        let ids = $scope.contacts.map((elem) => elem._id);
        console.log("IDS ARE")
        console.log(ids)
        SocialFactory.addThread({
            subject: $scope.subject,
            participants: ids
        })
    }

});
