'use strict';
const router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
const User = mongoose.models('User');
const ensure = require('../../configure/authentication/utils');

// no auth
router.get('/', (req, res) => {  // get all
    User.find({})
    .then(users => res.send(users))
});

// no auth
router.post('/', (req, res) => { // create new
    User.create(req.body)
    .then(newUser => res.send(newUser))
});

// no auth
router.get('/:id', (req, res) => { // get one
    User.findById(req.params.id)
    .then(user => res.send(user))
});

// must be user or admin
router.put('/:id', ensureSelfOrAdmin, (req, res) => { // edit one
    if (req.user._id === req.params.id || req.user.isAdmin === true)
    User.findById(req.params.id)
    .then(user => {
        for (let key in req.body){ // doesn't require sending the whole object back and forth
            user[key] = req.body[key]
        }
        // user = req.body // requires sending the whole object, but maybe less risky than overwriting the whole object?
        return user.save()
    })
    .then(newUser => res.send(newUser))
});
