const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/twitterclone', {

});

const tweetSchema = new mongoose.Schema({
    content: String,
    createdAt: { type: Date, default: Date.now },
});

const Tweet = mongoose.model('Tweet', tweetSchema);


app.get('/tweets', async (req, res) => {
    const tweets = await Tweet.find();
    res.json(tweets);
});

app.post('/tweets', async (req, res) => {
    const newTweet = new Tweet(req.body);
    await newTweet.save();
    res.status(201).json(newTweet);
});

app.get('/tweets/:id', async (req, res) => {
    const tweet = await Tweet.findById(req.params.id);
    res.json(tweet);
});


app.get('/', (req, res) => {
    res.send('API is running');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const authRoutes = require('./routes/auth');

app.use(express.json());
app.use('/api/auth', authRoutes);
