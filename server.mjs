// server.mjs
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3000;


app.use(cors());

app.use(express.json()); // optional for JSON payloads

// --- Leaderboard endpoint ---
app.get('/leaderboard', async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        if (!fromDate || !toDate) {
            return res.status(400).json({ error: 'Missing fromDate, toDate, or token cookie' });
        }

        const apiUrl = `https://api.thrill.com/referral/v1/referral-links/streamers?fromDate=${fromDate}&toDate=${toDate}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Cookie': `token=eyJhbGciOiJSUzI1NiIsImtpZCI6Imp3ay1saXZlLTk4MDcyZDY2LWU0NWMtNDIwMi1iNWY1LTRiZWRkYmY4ZjhhOCIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsicHJvamVjdC1saXZlLWU2NzZhMmEwLTY2NmMtNDVhMi05ZGE4LTcwY2IzZTU4M2FmOSJdLCJlbWFpbCI6ImRpYW1vbmRrbm94c3luZGljYXRlQHlhaG9vLmNvbSIsImV4cCI6MTc1NjIxNjExNiwiaHR0cHM6Ly9zdHl0Y2guY29tL3Nlc3Npb24iOnsiaWQiOiJzZXNzaW9uLWxpdmUtNTAzZDhkMGEtZjdiNC00MTJjLWE4ZjUtMjlkMjM0ODAwMzRmIiwic3RhcnRlZF9hdCI6IjIwMjUtMDgtMjZUMTM6NDM6MzVaIiwibGFzdF9hY2Nlc3NlZF9hdCI6IjIwMjUtMDgtMjZUMTM6NDM6MzZaIiwiZXhwaXJlc19hdCI6IjIwMjUtMDktMjVUMTM6NDM6MzVaIiwiYXR0cmlidXRlcyI6eyJ1c2VyX2FnZW50IjoiIiwiaXBfYWRkcmVzcyI6IiJ9LCJhdXRoZW50aWNhdGlvbl9mYWN0b3JzIjpbeyJ0eXBlIjoicGFzc3dvcmQiLCJkZWxpdmVyeV9tZXRob2QiOiJrbm93bGVkZ2UiLCJsYXN0X2F1dGhlbnRpY2F0ZWRfYXQiOiIyMDI1LTA4LTI2VDEzOjQzOjM1WiJ9XX0sImlhdCI6MTc1NjIxNTgxNiwiaXNzIjoic3R5dGNoLmNvbS9wcm9qZWN0LWxpdmUtZTY3NmEyYTAtNjY2Yy00NWEyLTlkYTgtNzBjYjNlNTgzYWY5IiwibmJmIjoxNzU2MjE1ODE2LCJwdWJsaWNJZCI6IjJhMGYwMGY5LTA3ZTktNDY2ZS05NDBmLTFiNDgxNGNmMDZmYSIsInJvbGUiOiJQTEFZRVIiLCJzdWIiOiJ1c2VyLWxpdmUtYzc2MGZhNTQtZThmYi00OGNmLTgyODktMGNlN2VjZmIxNDA5In0.FFYvw_AoypbxpSNfifZrJr0bgXVtvnuQQg4AFZ4pGkl1XRJGG99YJeEoc4pYG9z4M2nmYsBwkbhzAXHovsdlj7FbKxt4bMJaVEfRVrsZygy5MWY1ONr8exd3DTSUI1lT8mvvoZLzHaVHBzMWnHd8SizN61wcz9uJDrKgnIqie5OH9FHGwaPZQTIJ-aTM6aZqQs3ou-h3X_b4Euj0Zk0Cs5usCWEhwqQ8eKUJIhjiDcPuDFx0-XcE2J57iqC0I53rB_-2VqVvm4z6XEVPUhHrgFwQOZU9goZxcPmvnzmkVkSze3n0Ah8V6Xuy1XSPzutzhYzW2cMx74Cr8szYWzT78A`
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch data from Thrill API' });
        }

        const data = await response.json();

        if (Array.isArray(data.items)) {
            res.json({
                success: true,
                players: data.items,
                totalCount: data.totalCount,
                isLastBatch: data.isLastBatch
            });
        } else {
            res.status(500).json({ error: 'Invalid data format', details: 'No valid items array found' });
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Error fetching leaderboard', details: error.message });
    }
});

// --- Optional: serve static files ---
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
