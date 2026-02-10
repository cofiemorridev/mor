#!/bin/bash

echo "🧹 Cleaning up..."
pkill -f "vite" 2>/dev/null || true

echo "📦 Installing dependencies..."
npm install

echo "🚀 Starting development server..."
echo "🌐 Open: http://localhost:5173"
echo ""
npm run dev
