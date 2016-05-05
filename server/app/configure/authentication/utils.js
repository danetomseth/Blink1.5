var authenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};


// check if it's the user or admin making a request
var selfOrAdmin = (req, res, next) => {
    if (req.user._id === req.params.id || req.user.isAdmin === true) {
        next();
    } else {
        res.status(401).end();
    }
};

module.exports = {
    authenticated: authenticated,
    selfOrAdmin: selfOrAdmin
}
