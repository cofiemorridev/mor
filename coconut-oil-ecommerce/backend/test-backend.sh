#!/bin/bash

echo "Testing Coconut Oil E-commerce Backend"
echo "======================================"

# Start backend
cd /workspaces/mor/coconut-oil-ecommerce/backend
npm run dev &
BACKEND_PID=$!
sleep 5

echo "1. Testing API endpoints:"
echo "-------------------------"

# Array of endpoints to test
endpoints=(
  "http://localhost:5000/api/health"
  "http://localhost:5000/api/products"
  "http://localhost:5000/api/payment/test"
  "http://localhost:5000/api/payment/channels"
)

for endpoint in "${endpoints[@]}"; do
  response=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
  if [ "$response" = "200" ]; then
    echo "✅ $endpoint"
  else
    echo "❌ $endpoint (HTTP $response)"
  fi
done

echo ""
echo "2. Testing payment initialization:"
echo "----------------------------------"

payment_response=$(curl -s -X POST http://localhost:5000/api/payment/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "amount": 50.00,
    "metadata": {
      "orderNumber": "TEST-001"
    }
  }')

if echo "$payment_response" | grep -q "authorization_url"; then
  echo "✅ Payment initialization successful"
  echo "   Response includes authorization_url"
else
  echo "❌ Payment initialization failed"
  echo "   Response: $payment_response"
fi

echo ""
echo "3. Testing order creation:"
echo "--------------------------"

order_response=$(curl -s -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerInfo": {
      "name": "Test Customer",
      "email": "test@example.com",
      "phone": "0241234567"
    },
    "shippingAddress": {
      "street": "123 Test Street",
      "city": "Accra",
      "region": "Greater Accra"
    },
    "items": [
      {
        "name": "Pure Coconut Oil",
        "price": 25.00,
        "quantity": 2
      }
    ],
    "subtotal": 50.00,
    "total": 65.00
  }')

if echo "$order_response" | grep -q "success"; then
  echo "✅ Order creation successful"
  order_number=$(echo "$order_response" | grep -o '"orderNumber":"[^"]*"' | cut -d'"' -f4)
  echo "   Order Number: $order_number"
else
  echo "❌ Order creation failed"
  echo "   Response: $order_response"
fi

echo ""
echo "Summary:"
echo "========"
echo "Backend is running on: http://localhost:5000"
echo "Frontend should be at: http://localhost:5173"
echo ""
echo "To start full development environment:"
echo "cd /workspaces/mor/coconut-oil-ecommerce"
echo "./start-dev.sh"

# Clean up
kill $BACKEND_PID 2>/dev/null || true
