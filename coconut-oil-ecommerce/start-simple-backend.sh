#!/bin/bash

echo "Starting Coconut Oil E-commerce Backend..."
echo "=========================================="

cd backend

# Kill any existing process on port 5000
pkill -f "node.*5000" 2>/dev/null || true

# Start the server
node src/server.js
