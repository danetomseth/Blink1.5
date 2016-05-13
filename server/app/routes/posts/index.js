'use strict';
const router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Thread = mongoose.model('Thread');
const ensure = require('../../configure/authentication/ensure');

// no auth
router.get('/', (req, res) => {  // get all
    Post.find({type: 'post'})
    .populate('author likes inReplyTo')
    .then(posts => res.send(posts))
});

// ensure authenticated
router.post('/', ensure.authenticated, (req, res) => { // create new
    let newPost;
    if(!req.body.author) {return res.status(401).end()} // make sure theres an author for this post
    // req.body.author = req.user._id // force the author to be the requester, ensures nobody spoofs someone else. Could also make sure author === requester, but I prefer this method
    Post.create(req.body)
    // .then(post => {
    //     newPost = post;
    //     return Thread.findById(req.body.threadId);
    // })
    // .then(thread => {
    //     thread.messages.push(newPost._id);
    //     return thread.save();
    // })
    .then((newPost) => res.send(newPost));
});

// ensure owner or admin is viewing
router.get('/:id', ensure.selfOrAdmin, (req, res) => { // get one...outside of context of thread
    Post.findById(req.params.id)
    .then(post => {
            res.send(post)
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
