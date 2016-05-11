'use strict';
const router = require('express').Router();
module.exports = router;
const predict = require('predict-next-word');

router.get('/seed', (req, res) =>{
    predict.ingestFile() // sync
    res.send("seeded")
});

router.get('/:words', (req, res) => {
    let prediction = predict.getNextWords(req.params.words)
    res.send(prediction)
});

router.put('/', (req, res) => {
    console.log("ingesting text")
    predict.ingest(req.body.text) // sync
    res.send("ingested")
});

