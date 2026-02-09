#!/bin/bash

echo "🔍 MANUAL SERVICE TEST"
echo "======================"

cd /workspaces/mor/coconut-oil-ecommerce

# Test backend
echo "1. Testing Backend..."
cd backend
echo "   Starting backend in background..."
npm start > ../logs/backend-test.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait a bit
sleep 3

# Check if backend is running
echo "   Checking if backend is running..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "   ✅ Backend is running!"
    curl -s http://localhost:5000/api/health | jq . 2>/dev/null || curl -s http://localhost:5000/api/health
else
    echo "   ❌ Backend not responding"
    echo "   Backend logs:"
    tail -20 ../logs/backend-test.log
fi

# Kill backend
kill $BACKEND_PID 2>/dev/null

cd ..

# Test frontend
echo ""
echo "2. Testing Frontend..."
cd frontend
echo "   Starting frontend in background..."
npm run dev > ../logs/frontend-test.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Wait a bit
sleep 5

# Check if frontend is running
echo "   Checking if frontend is running..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "   ✅ Frontend is running!"
    echo "   HTML response (first 100 chars):"
    curl -s http://localhost:5173 | head -c 100
    echo "..."
else
    echo "   ❌ Frontend not responding"
    echo "   Frontend logs:"
    tail -20 ../logs/frontend-test.log
fi

# Kill frontend
kill $FRONTEND_PID 2>/dev/null

cd ..

echo ""
echo "🎯 TEST COMPLETE"
