require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// API endpoint to safely get API keys
app.get('/api/config', (req, res) => {
    // Only send necessary API configuration
    res.json({
        clearbitKey: process.env.CLEARBIT_API_KEY,
        // Translation feature - commented out
        // googleTranslateKey: process.env.GOOGLE_TRANSLATE_API_KEY
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
