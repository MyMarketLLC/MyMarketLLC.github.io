const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Serve static files
app.get('/robotic-arm', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'RoboticArm.html'));
});

app.get('/control', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Control.html'));
});

// Track API endpoint
app.post('/api/track', async (req, res) => {
    const { pageType, thoughts, scanTime, timeSpent } = req.body;

    try {
        const connection = await pool.getConnection();
        
        await connection.execute(
            'INSERT INTO page_visits (page_type, thoughts, scan_time, time_spent) VALUES (?, ?, ?, ?)',
            [pageType, thoughts, scanTime, timeSpent]
        );

        connection.release();
        res.status(200).json({ message: 'Data recorded successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to record data' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});