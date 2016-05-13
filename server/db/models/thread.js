//'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    subject: {
        type: String
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
    // messages: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Post'
    // }]
})

// Hooks

// Virtuals

// Statics

// Methods

mongoose.model('Thread', schema);
