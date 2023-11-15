// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/newsportal', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Define the User schema
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' }],
});

const User = mongoose.model('User', userSchema);

// Define the Publisher schema
const publisherSchema = new mongoose.Schema({
    name: String,
    tags: [String],
});

const Publisher = mongoose.model('Publisher', publisherSchema);

// Routes
// User registration
app.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        const newUser = new User({ email });
        await newUser.save();
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/publishers', async (req, res) => {
    try {
        const publishers = await Publisher.find().sort({ name: 'asc' });
        res.json(publishers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/publishers', async (req, res) => {
    const { name, tags } = req.body;

    try {
        const newPublisher = new Publisher({ name, tags });
        await newPublisher.save();
        res.json(newPublisher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bookmark a news publisher
app.post('/bookmark', async (req, res) => {
    const { email, publisherId } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const publisher = await Publisher.findById(publisherId);

        if (!publisher) {
            return res.status(404).json({ error: 'Publisher not found' });
        }

        // Check if the publisher is already bookmarked by the user
        if (user.bookmarks.includes(publisherId)) {
            return res.status(400).json({ error: 'Publisher already bookmarked' });
        }

        // Bookmark the publisher
        user.bookmarks.push(publisherId);
        await user.save();

        res.json({ message: 'Publisher bookmarked successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
