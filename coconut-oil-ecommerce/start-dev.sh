#!/bin/bash

echo "Starting Coconut Oil E-commerce Development Environment..."
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
  echo "Error: Please run this script from the project root directory"
  echo "Current directory: $(pwd)"
  exit 1
fi

# Kill any existing processes on our ports
echo "Cleaning up existing processes..."
pkill -f "nodemon src/server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

# Start backend
echo "Starting Backend (Port 5000)..."
cd backend && npm run dev &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start frontend
echo "Starting Frontend (Port 5173)..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
echo "Waiting for frontend to start..."
sleep 3

echo ""
echo "========================================"
echo "🚀 Development servers are running!"
echo "========================================"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:5000"
echo "Backend Health: http://localhost:5000/api/health"
echo ""
echo "Admin Demo Login:"
echo "  Email: admin@coconutoil.com"
echo "  Password: Admin123!"
echo ""
echo "========================================"
echo "Press Ctrl+C to stop both servers"
echo ""

# Keep script running and handle cleanup
trap "echo ''; echo 'Shutting down servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
