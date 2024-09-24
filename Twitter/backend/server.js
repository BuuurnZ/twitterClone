const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Assurez-vous que bcrypt est installé

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/twitter_clone', {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Modèle d'utilisateur
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

// Modèle de tweet
const Tweet = mongoose.model('Tweet', new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
}));

// Route d'inscription
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        if (error.code === 11000) {
            // 11000 est le code d'erreur MongoDB pour un doublon
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(400).json({ message: 'Error creating user' });
        }
    }
});

// Route de connexion
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    console.log(`Attempting to log in user: ${username}`); // Journal de débogage
    try {
        const user = await User.findOne({ username });

        if (!user) {
            console.log('User not found'); // Journal de débogage
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(`Password valid: ${isPasswordValid}`); // Journal de débogage

        if (isPasswordValid) {
            return res.json({ success: true, message: 'Login successful' });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Login error' });
    }
});

// Route pour récupérer les tweets
app.get('/tweets', async (req, res) => {
    try {
        const tweets = await Tweet.find();
        res.json(tweets);
    } catch (error) {
        console.error('Error fetching tweets:', error);
        res.status(500).json({ message: 'Error fetching tweets' });
    }
});

// Route pour créer un tweet
app.post('/tweets', async (req, res) => {
    const { content, author } = req.body;
    const newTweet = new Tweet({ content, author });

    try {
        await newTweet.save();
        res.status(201).json(newTweet);
    } catch (error) {
        console.error('Error creating tweet:', error);
        res.status(400).json({ message: 'Error creating tweet' });
    }
});

// Démarrer le serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
