require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Added path module

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static('public'));

app.get('/service-worker.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'service-worker.js')); // Updated to include path module
});

const PORT = process.env.PORT || 8021;

// Define the Submission Schema
const submissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });

const Submission = mongoose.model("Submission", submissionSchema);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/FarmSales', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if unable to connect
});

// GET endpoint to retrieve all submissions
app.get('/api/submissions', async (req, res) => {
    try {
        const submissions = await Submission.find();
        console.log('Retrieved submissions:', submissions);
        res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        console.error('Error retrieving submissions:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST endpoint to accept form submissions
app.post('/api/submissions', async (req, res) => {
    const { name, email, message } = req.body;

    // Debugging: Log the received data
    console.log('Received form data:', { name, email, message });

    // Basic validation
    if (!name || !email || !message) {
        console.error('Validation error:', { name, email, message });
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Create a new submission
        const newSubmission = new Submission({ name, email, message });
        await newSubmission.save(); // Save the submission to the database

        // Debugging: Log the saved data
        console.log('Saved submission:', newSubmission);

        res.status(201).json({ success: true, message: "Data saved successfully", data: newSubmission });
    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Analyze message using OpenAI API
app.post('/api/analyze', async (req, res) => {
    const { message } = req.body;
    const apiKey = process.env.OPENAI_API_KEY; // Use the environment variable
    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: message }],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const analysis = response.data.choices[0].message.content;
            return res.status(200).json({ success: true, analysis });
        } catch (error) {
            if (error.response && error.response.status === 429) {
                // Retry after a delay
                attempt++;
                const retryAfter = error.response.headers['retry-after'] || 1; // Fallback to 1 second
                console.log(`Rate limit hit, retrying in ${retryAfter} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            } else {
                console.error('Error contacting OpenAI:', error);
                return res.status(500).json({ success: false, error: 'Failed to analyze message' });
            }
        }
    }

    return res.status(429).json({ success: false, error: 'Too many requests, please try again later.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});