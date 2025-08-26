# Canva Connect API Starter Template

A simple starter template for building applications that integrate with the Canva Connect API using Node.js and Express.

## Features

- 🔐 OAuth 2.0 authentication flow with Canva
- 👤 User profile retrieval
- 🎨 Design listing functionality
- 🚀 Express.js server with session management
- 📝 Environment-based configuration
- 🛠️ Development-ready setup

## Prerequisites

- Node.js (v20.14.0 or higher)
- npm (v9 or v10)
- A Canva Developer account

## Getting Started

### 1. Create a Canva App

1. Go to the [Canva Developer Portal](https://www.canva.com/developers/apps)
2. Create a new app
3. Note down your **Client ID** and **Client Secret**
4. Set the redirect URI to: `http://localhost:3000/auth/callback`

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file with your Canva app credentials:
   ```bash
   CANVA_CLIENT_ID=your_actual_client_id
   CANVA_CLIENT_SECRET=your_actual_client_secret
   CANVA_REDIRECT_URI=http://localhost:3000/auth/callback
   SESSION_SECRET=your_random_session_secret
   PORT=3000
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Available Endpoints

- `GET /` - Home page with authentication status
- `GET /auth` - Initiate OAuth flow with Canva
- `GET /auth/callback` - OAuth callback endpoint
- `GET /profile` - Get authenticated user's profile
- `GET /designs` - List user's designs
- `GET /logout` - Clear session and logout
- `GET /health` - Health check endpoint

## Project Structure

```
canva-connect-api/
├── app.js              # Main application file
├── package.json        # Dependencies and scripts
├── env.example         # Environment variables template
├── start.sh           # Startup script
└── README.md          # This file
```

## API Scopes

This template requests the following Canva API scopes:
- `design:read` - Read access to user's designs
- `profile:read` - Read access to user's profile information

## Development

The application includes:
- Session-based authentication
- Error handling for API requests
- CORS support for cross-origin requests
- Static file serving capabilities

## Next Steps

Extend this template by:
- Adding more Canva API endpoints
- Implementing design creation/editing
- Adding a proper frontend UI
- Implementing proper session storage (Redis, database)
- Adding user management features

## Resources

- [Canva Connect API Documentation](https://www.canva.dev/docs/connect/)
- [Canva Developer Portal](https://www.canva.com/developers/)
- [OAuth 2.0 Flow Documentation](https://www.canva.dev/docs/connect/authentication/)

## License

MIT
