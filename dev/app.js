const express = require('express');
const session = require('express-session');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Serve static files
app.use(express.static('public'));

// Canva OAuth configuration
const CANVA_CLIENT_ID = process.env.CANVA_CLIENT_ID;
const CANVA_CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET;
const CANVA_REDIRECT_URI = process.env.CANVA_REDIRECT_URI || `http://localhost:${PORT}/auth/callback`;
const CANVA_OAUTH_URL = 'https://www.canva.com/api/oauth/authorize';
const CANVA_TOKEN_URL = 'https://api.canva.com/rest/v1/oauth/token';
const CANVA_API_BASE_URL = 'https://api.canva.com/rest/v1';

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Canva Connect API Starter</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 50px auto; 
                padding: 20px;
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                background: #7C3AED;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                margin: 10px 0;
            }
            .button:hover { background: #5B21B6; }
            .info { background: #F3F4F6; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <h1>🎨 Canva Connect API Starter</h1>
        <p>Welcome to your Canva Connect API integration starter template!</p>
        
        <div class="info">
            <h3>📋 Setup Required:</h3>
            <p>Before you can start, make sure to:</p>
            <ol>
                <li>Create a Canva app at <a href="https://www.canva.com/developers/apps" target="_blank">Canva Developer Portal</a></li>
                <li>Set your environment variables in the <code>.env</code> file</li>
                <li>Configure your redirect URI to: <code>${CANVA_REDIRECT_URI}</code></li>
            </ol>
        </div>

        ${CANVA_CLIENT_ID ? 
          `<a href="/auth" class="button">🔐 Connect with Canva</a>` : 
          `<p style="color: red;">⚠️ Please configure your CANVA_CLIENT_ID in the .env file</p>`
        }
        
        ${req.session.accessToken ? 
          `<div>
            <p>✅ You are connected to Canva!</p>
            <a href="/profile" class="button">👤 View Profile</a>
            <a href="/designs" class="button">🎨 List Designs</a>
            <a href="/logout" class="button">🚪 Logout</a>
          </div>` : ''
        }
    </body>
    </html>
  `);
});

// Start OAuth flow
app.get('/auth', (req, res) => {
  if (!CANVA_CLIENT_ID) {
    return res.status(400).send('CANVA_CLIENT_ID not configured');
  }

  const authUrl = `${CANVA_OAUTH_URL}?client_id=${CANVA_CLIENT_ID}&redirect_uri=${encodeURIComponent(CANVA_REDIRECT_URI)}&response_type=code&scope=design:read profile:read`;
  res.redirect(authUrl);
});

// OAuth callback
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code not provided');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(CANVA_TOKEN_URL, {
      grant_type: 'authorization_code',
      client_id: CANVA_CLIENT_ID,
      client_secret: CANVA_CLIENT_SECRET,
      redirect_uri: CANVA_REDIRECT_URI,
      code: code
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    req.session.accessToken = tokenResponse.data.access_token;
    req.session.refreshToken = tokenResponse.data.refresh_token;
    
    res.redirect('/');
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.status(500).send('Error during authentication');
  }
});

// Get user profile
app.get('/profile', async (req, res) => {
  if (!req.session.accessToken) {
    return res.redirect('/auth');
  }

  try {
    const response = await axios.get(`${CANVA_API_BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${req.session.accessToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching profile:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// List user's designs
app.get('/designs', async (req, res) => {
  if (!req.session.accessToken) {
    return res.redirect('/auth');
  }

  try {
    const response = await axios.get(`${CANVA_API_BASE_URL}/designs`, {
      headers: {
        'Authorization': `Bearer ${req.session.accessToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching designs:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Canva Connect API server running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to set your environment variables in .env file`);
});
