#!/bin/bash

echo "🚀 Starting Coconut Oil E-commerce Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
  if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
    return 0
  else
    return 1
  fi
}

# Check if ports are available
if check_port 5000; then
  echo -e "${YELLOW}⚠️ Port 5000 (backend) is already in use${NC}"
fi

if check_port 5173; then
  echo -e "${YELLOW}⚠️ Port 5173 (frontend) is already in use${NC}"
fi

# Kill any existing processes on these ports
echo "Cleaning up existing processes..."
pkill -f "node.*(server|vite)" 2>/dev/null || true

# Start backend
echo -e "\n${GREEN}1. Starting Backend (Port 5000)...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
sleep 5

# Check if backend started
if check_port 5000; then
  echo -e "${GREEN}✅ Backend started successfully${NC}"
else
  echo -e "${RED}❌ Backend failed to start${NC}"
  echo "Trying alternative method..."
  node src/server.js &
  BACKEND_PID=$!
  sleep 3
fi

# Start frontend
echo -e "\n${GREEN}2. Starting Frontend (Port 5173)...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!
sleep 5

# Check if frontend started
if check_port 5173; then
  echo -e "${GREEN}✅ Frontend started successfully${NC}"
else
  echo -e "${RED}❌ Frontend failed to start${NC}"
  echo "Trying alternative port..."
  PORT=3000 npm run dev &
  FRONTEND_PID=$!
  sleep 3
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Development servers are running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Frontend:${NC}"
echo "  Local: http://localhost:5173"
echo ""
echo -e "${YELLOW}Backend API:${NC}"
echo "  Health Check: http://localhost:5000/api/health"
echo "  Products: http://localhost:5000/api/products"
echo "  Admin Login: POST http://localhost:5000/api/admin/login"
echo ""
echo -e "${YELLOW}Demo Credentials:${NC}"
echo "  Email: admin@coconutoil.com"
echo "  Password: Admin123!"
echo ""
echo -e "${YELLOW}To stop servers:${NC} Press Ctrl+C"
echo ""

# Keep script running and handle cleanup
trap "echo ''; echo 'Shutting down servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

wait
