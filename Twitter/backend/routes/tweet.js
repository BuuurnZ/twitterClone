const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');

router.post('/', async (req, res) => {
    const newTweet = new Tweet({
        content: req.body.content,
        author: req.body.author, 
    });

    try {
        const savedTweet = await newTweet.save();
        res.status(201).json(savedTweet);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/', async (req, res) => {
    const tweets = await Tweet.find();
    res.status(200).send(tweets);
});

module.exports = router;
