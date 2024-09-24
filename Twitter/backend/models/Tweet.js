const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true }, // Champ pour l'auteur
}, { timestamps: true });

const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = Tweet;
