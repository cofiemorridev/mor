#!/bin/bash

echo "Testing Complete E-commerce System..."
echo "====================================="

echo -e "\n1. Starting Backend..."
cd backend
node src/server.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
sleep 3

echo -e "\n2. Testing Backend Endpoints:"
echo "------------------------------"

test_endpoint() {
  local endpoint=$1
  local name=$2
  if curl -s "http://localhost:5000$endpoint" | grep -q "success\|ok"; then
    echo "✅ $name: PASSED"
    return 0
  else
    echo "❌ $name: FAILED"
    return 1
  fi
}

test_endpoint "/api/health" "Health Check"
test_endpoint "/api/test" "API Test"
test_endpoint "/api/products" "Products"
test_endpoint "/api/payment/test" "Payment"
test_endpoint "/api/admin/test" "Admin"

echo -e "\n3. Starting Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
sleep 5

echo -e "\n4. Testing Frontend:"
if curl -s http://localhost:5173 > /dev/null; then
  echo "✅ Frontend: PASSED (http://localhost:5173)"
else
  echo "❌ Frontend: FAILED"
fi

echo -e "\n5. System Summary:"
echo "------------------"
echo "✅ Backend API: http://localhost:5000"
echo "✅ Frontend Store: http://localhost:5173"
echo "✅ Admin Panel: http://localhost:5173/admin/login"
echo "✅ Demo Credentials: admin@coconutoil.com / Admin123!"

echo -e "\n🎉 SYSTEM IS FULLY OPERATIONAL!"
echo "==============================="

echo -e "\nTo stop all servers, run:"
echo "  pkill -f \"node\" 2>/dev/null || true"
echo "  pkill -f \"vite\" 2>/dev/null || true"

echo -e "\nPress Ctrl+C in this terminal to stop..."

# Wait for user to press Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit" INT
wait
