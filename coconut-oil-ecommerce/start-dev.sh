#!/bin/bash

# Coconut Oil E-commerce Development Environment
echo "Starting Coconut Oil E-commerce Development Environment..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to kill processes on port
kill_port() {
  local port=$1
  local pid=$(lsof -ti:$port 2>/dev/null)
  if [ ! -z "$pid" ]; then
    echo -e "${YELLOW}Killing process on port $port (PID: $pid)...${NC}"
    kill -9 $pid 2>/dev/null
    sleep 1
  fi
}

# Clean up existing processes
echo -e "${YELLOW}Cleaning up existing processes...${NC}"
kill_port 5000  # Backend
kill_port 5173  # Frontend

# Start Backend
echo -e "${GREEN}Starting Backend (Port 5000)...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 5

# Check if backend is running
if curl -s http://localhost:5000/api/health > /dev/null; then
  echo -e "${GREEN}✓ Backend is running on http://localhost:5000${NC}"
else
  echo -e "${RED}✗ Backend failed to start${NC}"
  echo "Check backend logs for errors."
fi

# Start Frontend
echo -e "\n${GREEN}Starting Frontend (Port 5173)...${NC}"
if [ -d "frontend" ]; then
  cd frontend
  # Check if node_modules exists
  if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
  fi
  npm run dev &
  FRONTEND_PID=$!
  echo "Frontend PID: $FRONTEND_PID"
  cd ..
  
  # Wait for frontend to start
  echo -e "${YELLOW}Waiting for frontend to start...${NC}"
  sleep 8
  
  # Check if frontend is running
  if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✓ Frontend is running on http://localhost:5173${NC}"
  else
    echo -e "${YELLOW}⚠ Frontend might be starting slowly, check logs${NC}"
  fi
else
  echo -e "${YELLOW}⚠ Frontend directory not found. Creating basic frontend...${NC}"
  mkdir -p frontend
  cd frontend
  
  # Create minimal package.json
  cat > package.json << 'PKGEOF'
{
  "name": "coconut-oil-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "echo 'Frontend not fully configured. Please run Phase 10-14 first.' && python3 -m http.server 5173",
    "build": "echo 'Frontend not fully configured'"
  }
}
PKGEOF
  
  # Create simple HTML file
  mkdir -p public
  cat > public/index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coconut Oil Ghana - Frontend Coming Soon</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
            background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%);
            color: white;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .container {
            max-width: 600px;
            padding: 2rem;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        .coconut {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        .status {
            background: rgba(255,255,255,0.1);
            padding: 1rem;
            border-radius: 10px;
            margin: 1rem 0;
        }
        .links {
            margin-top: 2rem;
        }
        .links a {
            color: white;
            text-decoration: none;
            background: rgba(255,255,255,0.2);
            padding: 0.5rem 1rem;
            border-radius: 5px;
            margin: 0 0.5rem;
            display: inline-block;
        }
        .links a:hover {
            background: rgba(255,255,255,0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="coconut">🥥</div>
        <h1>Coconut Oil Ghana</h1>
        <p>Premium Coconut Oil E-commerce Platform</p>
        
        <div class="status">
            <h3>Backend API Status</h3>
            <p>Backend is running successfully!</p>
            <p>API Endpoints available:</p>
            <ul style="list-style: none; padding: 0;">
                <li>✅ /api/health - Health check</li>
                <li>✅ /api/products - Product listings</li>
                <li>✅ /api/orders - Order management</li>
                <li>✅ /api/payment - Paystack integration</li>
                <li>✅ /api/admin - Admin panel</li>
            </ul>
        </div>
        
        <p>Frontend React application will be built in Phase 10-14</p>
        
        <div class="links">
            <a href="http://localhost:5000/api/health" target="_blank">Backend Health</a>
            <a href="http://localhost:5000/api/products" target="_blank">Products API</a>
            <a href="http://localhost:5000/api/payment/test" target="_blank">Payment Test</a>
        </div>
    </div>
</body>
</html>
HTMLEOF
  
  # Start simple HTTP server
  cd public
  python3 -m http.server 5173 &
  FRONTEND_PID=$!
  echo "Simple frontend PID: $FRONTEND_PID"
  cd ../..
fi

echo -e "\n${GREEN}✅ Development servers started!${NC}"
echo ""
echo -e "${YELLOW}Access Points:${NC}"
echo "Backend API:  http://localhost:5000"
echo "Frontend:     http://localhost:5173"
echo ""
echo -e "${YELLOW}API Endpoints:${NC}"
echo "Health Check: http://localhost:5000/api/health"
echo "Products:     http://localhost:5000/api/products"
echo "Payment Test: http://localhost:5000/api/payment/test"
echo "Payment Channels: http://localhost:5000/api/payment/channels"
echo ""
echo -e "${YELLOW}To stop all servers, press Ctrl+C${NC}"
echo ""

# Keep script running
wait
