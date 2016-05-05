'use strict';
const router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const ensure = require('../../configure/authentication/ensure');

// no auth
router.get('/', (req, res) => {  // get all
    Post.find({})
    .then(posts => res.send(posts))
});

// ensure authenticated
router.post('/', ensure.authenticated, (req, res) => { // create new
    if(!req.body.author) {return res.status(401).end()} // make sure theres an author for this post
    req.body.author = req.user._id // force the author to be the requester, ensures nobody spoofs someone else. Could also make sure author === requester, but I prefer this method
    Post.create(req.body)
    .then(newPost => res.send(newPost))
});

// ensure owner or admin is viewing
router.get('/:id', ensure.selfOrAdmin, (req, res) => { // get one...outside of context of thread
    Post.findById(req.params.id)
    .then(post => {
        if (ensure.participant(post.participants)){ // may need to pass user ID as well. check for errors
            res.send(post)
        } else {
            res.status(401).end()
        }
    })
});

// ensure owner or admin
router.put('/:id', ensure.selfOrAdmin, (req, res) => { // edit one
    Post.findById(req.params.id)
    .then(post => {
        for (let key in req.body){ // doesn't require sending the whole object back and forth
            post[key] = req.body[key]
        }
        // post = req.body // requires sending the whole object, but maybe less risky than overwriting the whole object?
        return post.save()
    })
    .then(thingToSend => res.send(thingToSend))
});
