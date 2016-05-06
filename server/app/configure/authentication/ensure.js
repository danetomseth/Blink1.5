
// check if the user is logged in
const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};


// check if it's the user or admin making a request
const selfOrAdmin = (req, res, next) => {
    if (req.user._id === req.params.id || req.user.role === 'admin') {
        next();
    } else {
        res.status(401).end();
    }
};

const participant = (participants) => {
    if (participants.indexOf(req.user._id) || req.user.role === 'admin'){
        return true;
    } else {
        return false;
    }
};

module.exports = {
    authenticated: (req, res, next) => next(),
    selfOrAdmin: (req, res, next) => next(),
    participant: (req, res, next) => next()
};
