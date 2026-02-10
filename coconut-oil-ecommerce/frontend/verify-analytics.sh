#!/bin/bash

echo "🔍 VERIFYING ANALYTICS SETUP"
echo "============================="

cd /workspaces/mor/coconut-oil-ecommerce

echo ""
echo "1. Checking essential files:"
echo ""

essential_files=(
  "frontend/src/utils/analytics.js"
  "frontend/src/context/AnalyticsContext.jsx"
  "frontend/src/hooks/useAnalytics.js"
  "frontend/src/pages/Home.jsx"
  "frontend/src/pages/Products.jsx"
  "frontend/src/pages/Cart.jsx"
  "frontend/src/pages/Checkout.jsx"
  "frontend/src/App.jsx"
)

all_good=true
for file in "${essential_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (MISSING)"
    all_good=false
  fi
done

echo ""
echo "2. Checking services:"
echo ""

# Check backend
if curl -s http://localhost:5000/api/health > /dev/null; then
  echo "✅ Backend is running on port 5000"
else
  echo "❌ Backend not running"
  all_good=false
fi

# Check frontend
if curl -s http://localhost:5173 > /dev/null; then
  echo "✅ Frontend is running on port 5173"
else
  echo "❌ Frontend not running"
  all_good=false
fi

echo ""
echo "3. SUMMARY:"
echo "==========="

if [ "$all_good" = true ]; then
  echo "🎉 ALL SYSTEMS GO! Analytics setup is complete."
  echo ""
  echo "📊 Next steps:"
  echo "1. Visit http://localhost:5173"
  echo "2. Open browser DevTools (F12)"
  echo "3. Interact with the site"
  echo "4. Check console for analytics logs"
  echo "5. Look for '📊 [Analytics Dev]' messages"
else
  echo "⚠️  Some issues detected. Please run:"
  echo "   ./fix-analytics-setup.sh"
  echo "   Then ./start-all.sh"
fi

echo ""
echo "📋 Quick test commands:"
echo "   curl http://localhost:5173/products"
echo "   curl http://localhost:5000/api/health"
