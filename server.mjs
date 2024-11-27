// server.js or server.mjs

import express from 'express';
import fetch from 'node-fetch'; // or require('node-fetch') if using CommonJS
import cors from 'cors'; // Import the CORS package

const app = express();
const port = 3000;

// Your API endpoint and token
const apiUrl = 'https://europe-west2-g3casino.cloudfunctions.net/user/affiliate/referral-leaderboard';
const apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2ejY4NVBJTzU4dlQ4QnJEYnZJWiIsImlhdCI6MTczMjQ3NTgwMH0.LrvMTCaaB9Mv3KqiV9O7keEYf1eIQg8X6xj2ScL-fOg'; // Replace with your actual token

// Enable CORS for all routes
app.use(cors());

// Serve the static frontend files (optional)
app.use(express.static('public'));

// Proxy route to fetch leaderboard data
app.get('/leaderboard', async (req, res) => {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiToken}` // Ensure that the token is correct
            }
        });

        // If the response is not OK (status code 200), return the error
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch data' });
        }

        const data = await response.json();

        // Check if the data structure is valid and contains the players array
        if (data.success && Array.isArray(data.data)) {
            const players = data.data;  // The players array is directly in the data array

            // Send back only the players data
            res.json({ success: true, players: players });
        } else {
            res.status(500).json({ error: 'Invalid data format', details: 'No valid players data found' });
        }
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).json({ error: 'Error fetching leaderboard data', details: error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
