#!/bin/bash

echo "Starting Coconut Oil E-commerce Backend..."
echo "=========================================="

cd backend

# Kill any existing process on port 5000
pkill -f "node.*5000" 2>/dev/null || true

# Start the server
node src/server.js &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Waiting for server to start..."

# Wait for server to start
sleep 3

echo -e "\n✅ Testing backend..."
echo "===================="

# Test health endpoint
if curl -s http://localhost:5000/api/health | grep -q "ok"; then
  echo "✓ Health check: PASSED"
else
  echo "✗ Health check: FAILED"
  kill $BACKEND_PID 2>/dev/null || true
  exit 1
fi

# Test API endpoint
if curl -s http://localhost:5000/api/test | grep -q "success"; then
  echo "✓ API test: PASSED"
else
  echo "✗ API test: FAILED"
fi

# Test products endpoint
if curl -s http://localhost:5000/api/products | grep -q "success"; then
  echo "✓ Products API: PASSED"
else
  echo "✗ Products API: FAILED"
fi

# Test payment endpoint
if curl -s http://localhost:5000/api/payment/test | grep -q "success"; then
  echo "✓ Payment API: PASSED"
else
  echo "✗ Payment API: FAILED"
fi

# Test admin endpoint
if curl -s http://localhost:5000/api/admin/test | grep -q "success"; then
  echo "✓ Admin API: PASSED"
else
  echo "✗ Admin API: FAILED"
fi

echo -e "\n🎉 BACKEND IS RUNNING SUCCESSFULLY!"
echo "====================================="
echo ""
echo "Access Points:"
echo "• Health: http://localhost:5000/api/health"
echo "• API Test: http://localhost:5000/api/test"
echo "• Products: http://localhost:5000/api/products"
echo "• Payment: http://localhost:5000/api/payment/test"
echo "• Admin: http://localhost:5000/api/admin/test"
echo ""
echo "Frontend should connect to: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "To test the frontend, open another terminal and run:"
echo "cd frontend && npm run dev"

# Keep script running
wait $BACKEND_PID
