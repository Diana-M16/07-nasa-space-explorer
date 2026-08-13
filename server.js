// Load environment variables from .env file
// Note: In Vercel, environment variables are set in project settings, not .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Also explicitly serve common static files
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'style.css')));

// API route to fetch APOD data
// This proxies requests to NASA's API using the secure API key
app.get('/api/apod', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate required parameters
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    // Check for API key
    if (!process.env.NASA_API_KEY) {
      return res.status(500).json({ error: 'NASA_API_KEY not configured' });
    }

    // Build the NASA APOD API URL with the secure API key
    const nasaUrl = new URL('https://api.nasa.gov/planetary/apod');
    nasaUrl.searchParams.append('api_key', process.env.NASA_API_KEY);
    nasaUrl.searchParams.append('start_date', startDate);
    nasaUrl.searchParams.append('end_date', endDate);
    nasaUrl.searchParams.append('thumbs', 'true'); // Include thumbnail for video items

    // Fetch data from NASA API using native Node.js fetch
    const response = await fetch(nasaUrl.toString());
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from NASA API' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching APOD data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`NASA Space Explorer server running on http://localhost:${PORT}`);
});

