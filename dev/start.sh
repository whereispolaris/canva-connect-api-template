#!/bin/bash

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if .env file exists, if not copy from example
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please configure your Canva app credentials in the .env file"
fi

# Start the application
echo "🚀 Starting Canva Connect API server..."
npm start
