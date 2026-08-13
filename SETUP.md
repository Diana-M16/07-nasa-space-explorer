# NASA Space Explorer - Setup Guide

## Backend Setup

### 1. Install Dependencies
```bash
npm install
```

This installs:
- **express**: Web server framework
- **dotenv**: Loads environment variables from `.env` file
- **cors**: Enables cross-origin requests

### 2. Configure Your NASA API Key

#### Option A: Using `.env` file (Recommended for local development)
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace `your_nasa_api_key_here` with your actual NASA API key:
   ```
   NASA_API_KEY=your_actual_api_key_here
   ```

3. The `.env` file is **automatically ignored by Git** (see `.gitignore`)

#### Option B: Using Environment Variable (For production/deployment)
Set the environment variable before running the server:
```bash
export NASA_API_KEY=your_actual_api_key_here
npm start
```

### 3. Start the Server
```bash
npm start
```

The server will run on `http://localhost:3000`

## How It Works

### Security Flow:
1. **User clicks "Get Space Images"** in the browser
2. **Frontend** sends a request to `/api/apod?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
3. **Backend server** receives the request and:
   - Validates the dates
   - Uses the `NASA_API_KEY` from `.env` (stored securely on server, NOT in browser)
   - Makes a secure request to NASA's APOD API
   - Returns the data to the frontend
4. **Frontend** displays the images, titles, and dates in the gallery

### Why This Approach?
- ✅ **API Key Security**: Your NASA API key never reaches the browser
- ✅ **Request Control**: Backend validates all requests
- ✅ **Rate Limiting Ready**: Easy to add rate limiting in the future
- ✅ **Beginner-Friendly**: Simple Express backend, easy to understand and modify

## Troubleshooting

### "Cannot find module 'express'"
- Run: `npm install`

### "NASA_API_KEY not configured"
- Check that your `.env` file exists and contains `NASA_API_KEY=your_key`
- Verify you replaced the placeholder with your actual API key

### "Failed to fetch from NASA API"
- Check that your NASA API key is valid at https://api.nasa.gov
- Verify the date range is correct (NASA data available from 1995-06-16 onwards)

## File Structure
```
/
├── server.js          # Backend Express server (NEW)
├── package.json       # Node.js dependencies (NEW)
├── .env               # Your API key (NEW - DO NOT COMMIT)
├── .env.example       # Template for .env (NEW)
├── .gitignore         # Git ignore rules (NEW)
├── index.html         # Updated with button ID
├── style.css          # Updated gallery styling
├── js/
│   ├── script.js      # Updated with API integration
│   └── dateRange.js   # Unchanged
└── img/
    └── nasa-worm-logo.png
```
