
// check if the user is logged in
const authenticated = (req, res, next) => {
    console.log("checking auth")
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};


// check if it's the user or admin making a request
const selfOrAdmin = (req, res, next) => {
    console.log("req.user.id is", req.user._id);
    console.log("req.params.id is", req.params.id);
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


// TEMP DISABLED DURING DEV
module.exports = {
    authenticated: (req, res, next) => next(),
    selfOrAdmin: (req, res, next) => next(),
    participant: (req, res, next) => next()
};
