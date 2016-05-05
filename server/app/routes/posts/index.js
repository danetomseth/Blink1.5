'use strict';
const router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
const Post = mongoose.models('Post');

router.get('/', (req, res) => {  // get all

    res.send()
});

router.post('/', (req, res) => { // create new

    res.send()
});

router.get('/', (req, res) => { // get one

    res.send()
});

router.put('/', (req, res) => { // edit one

    res.send()
});
