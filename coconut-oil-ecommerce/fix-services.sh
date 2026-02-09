#!/bin/bash

echo "🔧 FIXING COMMON SERVICE ISSUES"
echo "================================"

cd /workspaces/mor/coconut-oil-ecommerce

# 1. Ensure backend has proper server.js
echo "1. Checking backend server.js..."
cd backend
if [ ! -f "src/server.js" ]; then
    echo "   ❌ server.js missing, creating basic one..."
    cat > src/server.js << 'SERVER'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Coconut Oil E-commerce API',
        timestamp: new Date().toISOString()
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.status(200).json({
        message: 'API is working!',
        endpoints: {
            health: '/api/health',
            test: '/api/test'
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Health: http://localhost:${PORT}/api/health`);
});
SERVER
    echo "   ✅ Created basic server.js"
else
    echo "   ✅ server.js exists"
fi

# Check package.json scripts
if ! grep -q '"start"' package.json; then
    echo "   ⚠️  Adding start script to package.json..."
    # Create temp file with start script
    cat > package-temp.json << 'PKG'
{
  "name": "coconut-oil-backend",
  "version": "1.0.0",
  "description": "Coconut Oil E-commerce Backend API",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
PKG
    mv package-temp.json package.json
    echo "   ✅ Added start script"
fi

cd ..

# 2. Ensure frontend has proper config
echo "2. Checking frontend configuration..."
cd frontend

# Check vite config
if [ ! -f "vite.config.js" ]; then
    echo "   ❌ vite.config.js missing, creating..."
    cat > vite.config.js << 'VITE'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true
  }
})
VITE
    echo "   ✅ Created vite.config.js"
fi

# Check package.json scripts
if ! grep -q '"dev"' package.json; then
    echo "   ⚠️  Adding dev script to package.json..."
    # Create temp file with dev script
    cat > package-temp.json << 'PKG'
{
  "name": "coconut-oil-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0"
  }
}
PKG
    mv package-temp.json package.json
    echo "   ✅ Added dev script"
fi

cd ..

# 3. Create logs directory
echo "3. Creating logs directory..."
mkdir -p logs

echo ""
echo "✅ Fix script completed!"
echo ""
echo "Now try starting services:"
echo "  ./start-all.sh"
