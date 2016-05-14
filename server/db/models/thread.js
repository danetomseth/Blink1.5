//'use strict';
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var schema = new mongoose.Schema({
    subject: {
        type: String
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
})

// Hooks

// Virtuals

// Statics

// Methods
// schema.methods.getMessages = () => {
//     return Post.find({threadId: this._id})
//     .populate('author')
// }

schema.plugin(deepPopulate);

mongoose.model('Thread', schema);
