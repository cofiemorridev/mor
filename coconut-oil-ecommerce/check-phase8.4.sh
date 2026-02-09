#!/bin/bash

echo "🎯 PHASE 8.4 READINESS CHECK"
echo "============================"

cd /workspaces/mor/coconut-oil-ecommerce

echo "1. Checking prerequisites..."
echo "   - Backend directory: $(if [ -d "backend" ]; then echo "✅"; else echo "❌"; fi)"
echo "   - Frontend directory: $(if [ -d "frontend" ]; then echo "✅"; else echo "❌"; fi)"
echo "   - Backend package.json: $(if [ -f "backend/package.json" ]; then echo "✅"; else echo "❌"; fi)"
echo "   - Frontend package.json: $(if [ -f "frontend/package.json" ]; then echo "✅"; else echo "❌"; fi)"

echo ""
echo "2. Checking if services can start..."
# Try to start services quickly
cd backend
timeout 10 node src/server.js > ../logs/quick-backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

cd ../frontend
timeout 10 npm run dev > ../logs/quick-frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

cd ..

echo "   Backend responding: $(if curl -s http://localhost:5000/api/health > /dev/null; then echo "✅"; else echo "❌"; fi)"
echo "   Frontend responding: $(if curl -s http://localhost:5173 > /dev/null; then echo "✅"; else echo "❌"; fi)"

# Kill test processes
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null

echo ""
echo "3. Phase 8.4 Analytics Readiness Assessment:"
echo "==========================================="

if curl -s http://localhost:5000/api/health > /dev/null && curl -s http://localhost:5173 > /dev/null; then
    echo "🚀 EXCELLENT! Ready for Analytics Integration"
    echo ""
    echo "You can proceed with Phase 8.4 to implement:"
    echo "1. Google Analytics tracking"
    echo "2. Performance monitoring"
    echo "3. User behavior analytics"
    echo "4. Conversion tracking"
else
    echo "⚠️  SERVICES NEED ATTENTION"
    echo ""
    echo "Before Phase 8.4, ensure:"
    echo "1. Backend runs on port 5000"
    echo "2. Frontend runs on port 5173"
    echo "3. Both services respond to HTTP requests"
    echo ""
    echo "Fix with: ./fix-services.sh then ./start-all.sh"
fi

echo ""
echo "🔗 Quick test:"
echo "   curl http://localhost:5000/api/health"
echo "   curl http://localhost:5173"
