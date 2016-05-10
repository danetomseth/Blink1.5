'use strict';
const router = require('express').Router();
module.exports = router;
const predict = require('predict-next-word');

router.get('/seed', (req, res) =>{
    console.log("injesting file")
    predict.injestFile() // sync
    res.send("seeded")
})
router.get('/:words', (req, res, next) => {
    let prediction = predict.getNextWords(req.params.words)
    res.send(prediction)
})

router.put('/', (req, res) => {
    console.log("injesting text")
    predict.injest(req.body.text) // sync
    res.send("injested")
})

