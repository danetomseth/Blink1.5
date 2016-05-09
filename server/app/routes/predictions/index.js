'use strict';
const router = require('express').Router();
module.exports = router;
const predict = require('predict');
console.log(predict)

router.get('/:words', (req, res, next) => {
    console.log("hello")
    console.log(req.params)
    let prediction = predict.getNextWords(req.params.words)
    console.log(prediction)
    res.send(prediction)
})
