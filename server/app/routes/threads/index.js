'use strict';
const router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Thread = mongoose.model('Thread');
const ensure = require('../../configure/authentication/ensure');

// no auth
router.get('/', (req, res) => {  // get all, probably never going to use...
    Thread.find({})
    .then(threads => res.send(threads))
});

// ensure authenticated
router.post('/', ensure.authenticated, (req, res) => { // create new
    Thread.create(req.body)
    .then(newThread => res.send(newThread))
});

// ensure participant or admin
router.get('/:id', ensure.authenticated, (req, res, next) => { // get one
    Thread.findById(req.params.id)
    .then(thread => {
        if (ensure.participant(thread.participants)){ // may need to pass user ID as well. check for errors
    Post.find({threadId: req.params.id})
    .then((posts) => res.send(posts))

        } else {
            res.status(401).end()
        }
    })
});

// ensure participant or admin
router.put('/:id', ensure.authenticated, (req, res, next) => { // edit one
    delete req.body.messages // don't let anyone change the messages, but let them add or remove participants or update the subject
    Thread.findById(req.params.id)
    .then(thread => {
        if (ensure.participant(thread.participants)){ // may need to pass user ID as well. check for errors
            for (let key in req.body){ // doesn't require sending the whole object back and forth
                thread[key] = req.body[key]
            }
            // thread = req.body // requires sending the whole object, but maybe less risky than overwriting the whole object?
            return thread.save()
        } else {
            res.status(401)
            return "Not Authorized"
        }
    })
    .then(thingToSend => res.send(thingToSend))
});
