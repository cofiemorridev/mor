#!/bin/bash

echo "🔧 COCONUT OIL E-COMMERCE - FIX SCRIPT"
echo "======================================"

cd /workspaces/mor/coconut-oil-ecommerce

# 1. Check if backend is running
echo -e "\n1. Checking backend..."
if ! curl -s http://localhost:5000/api/health > /dev/null; then
    echo "   ❌ Backend not running. Starting..."
    cd backend
    pkill -f "node" 2>/dev/null || true
    npm start > /dev/null 2>&1 &
    cd ..
    sleep 5
    echo "   ✅ Backend started"
else
    echo "   ✅ Backend is running"
fi

# 2. Check if frontend is running
echo -e "\n2. Checking frontend..."
if ! curl -s http://localhost:5173 > /dev/null; then
    echo "   ❌ Frontend not running. Starting..."
    cd frontend
    pkill -f "vite" 2>/dev/null || true
    npm run dev > /dev/null 2>&1 &
    cd ..
    sleep 5
    echo "   ✅ Frontend started"
else
    echo "   ✅ Frontend is running"
fi

# 3. Check if MongoDB is connected
echo -e "\n3. Checking database connection..."
cd backend
if node -e "
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coconut-oil')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
" 2>/dev/null; then
    echo "   ✅ MongoDB connection OK"
else
    echo "   ❌ MongoDB connection issue detected"
    echo "   Setting up local MongoDB for testing..."
    
    # Install MongoDB if not present
    if ! command -v mongod &> /dev/null; then
        echo "   Installing MongoDB..."
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        sudo apt-get update
        sudo apt-get install -y mongodb-org
    fi
    
    # Start MongoDB service
    sudo systemctl start mongod 2>/dev/null || true
    sudo systemctl enable mongod 2>/dev/null || true
    
    # Update .env to use local MongoDB
    if [ -f .env ]; then
        sed -i 's|MONGODB_URI=.*|MONGODB_URI=mongodb://localhost:27017/coconut-oil|g' .env
    fi
    echo "   ✅ Local MongoDB setup complete"
fi
cd ..

# 4. Check required files
echo -e "\n4. Checking required files..."
check_file() {
    if [ -f "$1" ]; then
        echo "   ✅ $1"
    else
        echo "   ❌ Missing: $1"
        return 1
    fi
}

check_file "frontend/public/manifest.json"
check_file "frontend/public/offline.html"
check_file "backend/src/server.js"
check_file "frontend/src/App.jsx"

# 5. Check dependencies
echo -e "\n5. Checking dependencies..."
if [ -d "backend/node_modules" ]; then
    echo "   ✅ Backend dependencies installed"
else
    echo "   ❌ Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

if [ -d "frontend/node_modules" ]; then
    echo "   ✅ Frontend dependencies installed"
else
    echo "   ❌ Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# 6. Run a quick test
echo -e "\n6. Running quick test..."
sleep 3

curl_test() {
    local url=$1
    local name=$2
    echo -n "   Testing $name: "
    if timeout 5 curl -s "$url" > /dev/null; then
        echo "✅ OK"
        return 0
    else
        echo "❌ FAILED"
        return 1
    fi
}

curl_test "http://localhost:5000/api/health" "Backend"
curl_test "http://localhost:5173" "Frontend"

echo -e "\n🎯 FIX SCRIPT COMPLETE"
echo "Run 'node simple-test.cjs' for comprehensive results"
