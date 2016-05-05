'use strict';
const mongoose = require('mongoose');
const Thread = mongoose.model('Thread');

const schema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        String
    },
    content: {
        type: String
    },
    inReplyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    type: {
        type: String,
        enum: ['post', 'message']
    },
    status: {
        type: String,
        enum: ['published', 'hidden', 'deleted']
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastEdit: {
        type: Date,
        default: Date.now
    },
    flags: {
        type: String,
        enum: ['violation', 'promoted'] // maybe add 'pinned' for "local" promotion vs "global" promotion
    }
})

// Hooks

// all new posts should come in with a threadId which we want to use and then remove before saving to the DB
schema.pre('save', function (next) {

    let threadId = this.threadId;
    delete this.threadId;
    Thread.findById(threadId) // find the post it's in reply to
    .then(thread => {
        thread.messages.push(this._id) // add this post to the thread messages
        return thread.save() // save it
    })
    .then(next)

});

// Virtuals


// Statics


// Methods
schema.methods.getReplies = () => {
    return this.model('Post').find({inReplyTo: this.id})
    .populate('author likes')
}

mongoose.model('Post', schema);
