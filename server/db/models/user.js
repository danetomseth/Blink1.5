//'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    profilePicture: {
        type: String,
        default: "http://pbs.twimg.com/profile_images/646789025823457281/yFarHEX9.jpg"
    },
    photos: {
        type: [String]
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    caregiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'caregiver'],
        default: 'user'
    },
    keyboardSpeed : {
        type: Number,
        default: 3
    },
    trackingFeature: {
        type: String,
        default: 'eyebrows'
    },
    eyeThreshold: {
        type: Number,
        default: 0.85
    }
});

schema.virtual('username').get(function() {
    return this.firstName + " " + this.lastName[0] + "."
})

// method to remove sensitive information from user objects before sending them out
schema.methods.sanitize = function() {
    return _.omit(this.toJSON(), ['password', 'salt']);
};

// Adding friends
schema.methods.addFriend = function(id) {
    // Add friend if not already in friend array
    if (this.friends.indexOf(id) < 0) {
        this.friends.push(id);
    }
    return this.save();
};

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function() {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function(plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }
    next();
});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function(candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', schema);
