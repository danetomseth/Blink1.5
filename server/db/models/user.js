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
        default: "https://d30y9cdsu7xlg0.cloudfront.net/noun-svg/169696.svg?Expires=1462482913&Signature=jWIBsZNWRrjf32rsrhtmR~z0Rb2AlmyCFCGE0nQNeh4fd6gUy8xqnc2-6JJR5WaNObrcBNsMmwjGsrhmFP~h5i0g7yoTHWS7gEZtPfxhL42-aIECCcIgpfyELyNZaSCm8YnMrkqJYLC8I-xGHjz72zUtcM4wZV7IZWVF2cE1wSw_&Key-Pair-Id=APKAI5ZVHAXN65CHVU2Q"
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
    }

    // twitter: {
    //     id: String,
    //     username: String,
    //     token: String,
    //     tokenSecret: String
    // },
    // facebook: {
    //     id: String
    // },
    // google: {
    //     id: String
    // }
});

schema.virtual('username').get(function(){
    return this.firstName + " " + this.lastName[0] + "."
})

// method to remove sensitive information from user objects before sending them out
schema.methods.sanitize = function () {
    return _.omit(this.toJSON(), ['password', 'salt']);
};

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', schema);
