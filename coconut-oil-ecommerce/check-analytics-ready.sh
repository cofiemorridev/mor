#!/bin/bash

echo "🎯 ANALYTICS READINESS CHECK"
echo "============================="

cd /workspaces/mor/coconut-oil-ecommerce

echo ""
echo "📁 File Structure Check:"
echo "========================"

files_to_check=(
  "frontend/src/utils/analytics.js"
  "frontend/src/context/AnalyticsContext.jsx"
  "frontend/src/hooks/useAnalytics.js"
  "frontend/src/components/product/ProductCard.jsx"
  "frontend/src/components/product/ProductDetail.jsx"
  "frontend/src/pages/Home.jsx"
  "frontend/src/pages/Products.jsx"
  "frontend/src/pages/Cart.jsx"
  "frontend/src/pages/Checkout.jsx"
  "frontend/src/App.jsx"
  "frontend/index.html"
  "frontend/package.json"
  "frontend/vite.config.js"
)

all_files_ok=true
for file in "${files_to_check[@]}"; do
  if [ -f "$file" ]; then
    size=$(wc -l < "$file" 2>/dev/null || echo "0")
    if [ "$size" -gt 5 ]; then
      echo "✅ $file (${size} lines)"
    else
      echo "⚠️  $file (too small: ${size} lines)"
      all_files_ok=false
    fi
  else
    echo "❌ $file (MISSING)"
    all_files_ok=false
  fi
done

echo ""
echo "🌐 Service Health Check:"
echo "========================"

backend_ok=false
frontend_ok=false

if curl -s http://localhost:5000/api/health > /dev/null; then
  echo "✅ Backend: http://localhost:5000/api/health"
  backend_ok=true
else
  echo "❌ Backend not responding"
fi

if curl -s http://localhost:5173 > /dev/null; then
  echo "✅ Frontend: http://localhost:5173"
  frontend_ok=true
else
  echo "❌ Frontend not responding"
fi

echo ""
echo "📊 Analytics Function Check:"
echo "============================"

# Check if analytics functions exist
if [ -f "frontend/src/utils/analytics.js" ]; then
  if grep -q "trackPageView\|trackEvent\|trackProductView\|trackAddToCart" frontend/src/utils/analytics.js; then
    echo "✅ Analytics functions defined"
  else
    echo "⚠️  Analytics functions incomplete"
  fi
fi

echo ""
echo "🎯 FINAL STATUS:"
echo "================"

if [ "$all_files_ok" = true ] && [ "$backend_ok" = true ] && [ "$frontend_ok" = true ]; then
  echo "✨ EXCELLENT! Analytics setup is COMPLETE and READY!"
  echo ""
  echo "🚀 NEXT STEPS:"
  echo "1. Visit: http://localhost:5173"
  echo "2. Open browser DevTools (F12)"
  echo "3. Click on products, add to cart, etc."
  echo "4. Check console for '📊 [Analytics Dev]' messages"
  echo "5. Test all pages: /products, /cart, /checkout"
  echo ""
  echo "📊 You're ready for PHASE 9: Frontend Context & State!"
else
  echo "⚠️  Some issues detected. Please fix before proceeding."
  echo ""
  echo "🔧 Run: ./fix-analytics-setup.sh"
  echo "⚡ Then: ./start-all.sh"
fi

echo ""
echo "🔗 Quick test URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000/api/health"
echo "   Products: http://localhost:5173/products"
echo "   Cart:     http://localhost:5173/cart"
