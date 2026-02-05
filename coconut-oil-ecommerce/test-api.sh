#!/bin/bash

echo "Testing API Endpoints..."
echo "========================"

# Test health endpoint
echo "1. Testing /api/health..."
curl -s http://localhost:5000/api/health | python3 -m json.tool || echo "Failed"

# Test products endpoint
echo ""
echo "2. Testing /api/products..."
curl -s http://localhost:5000/api/products | python3 -m json.tool || echo "Failed"

# Test admin login
echo ""
echo "3. Testing /api/admin/login..."
curl -s -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@coconutoil.com","password":"Admin123!"}' | python3 -m json.tool || echo "Failed"
