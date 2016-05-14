'use strict';
const router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Thread = mongoose.model('Thread');

const ensure = require('../../configure/authentication/ensure');

// no auth
router.get('/', (req, res) => {  // get all
    // Post.find({type: 'message'})
    // .populate('author likes inReplyTo')
    // .then(posts => {
    //     // posts = posts.filter((post) => (post.author === req.user._id));
    //     res.send(posts);
    // })
    Thread.find({participants: req.user._id})
    .populate('messages participants')
    .deepPopulate('messages.author')
    // .populate('messages')
    .then((threads) => res.send(threads));
});
