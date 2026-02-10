#!/bin/bash

echo "🔍 VERIFYING ANALYTICS SETUP"
echo "============================="

echo ""
echo "1. Checking file structure:"
echo "---------------------------"
check_file() {
    if [ -f "$1" ]; then
        lines=$(wc -l < "$1")
        if [ $lines -gt 10 ]; then
            echo "✅ $1 ($lines lines)"
        else
            echo "⚠️  $1 (too small: $lines lines)"
        fi
    else
        echo "❌ $1 (missing)"
    fi
}

check_file "frontend/src/utils/analytics.js"
check_file "frontend/src/context/AnalyticsContext.jsx"
check_file "frontend/src/hooks/useAnalytics.js"
check_file "frontend/src/components/product/ProductCard.jsx"

echo ""
echo "2. Checking services:"
echo "--------------------"
curl -s http://localhost:5000/api/health > /dev/null && echo "✅ Backend is healthy" || echo "❌ Backend not responding"
curl -s http://localhost:5173 > /dev/null && echo "✅ Frontend is accessible" || echo "❌ Frontend not accessible"

echo ""
echo "3. Quick component test:"
echo "-----------------------"
echo "Testing ProductCard component..."
if grep -q "trackProductView" frontend/src/components/product/ProductCard.jsx; then
    echo "✅ ProductCard has analytics tracking"
else
    echo "❌ ProductCard missing analytics"
fi

echo ""
echo "📊 ANALYTICS SETUP SUMMARY"
echo "=========================="
echo "The analytics system should now be ready for Phase 8.4."
echo ""
echo "Next steps:"
echo "1. Visit http://localhost:5173"
echo "2. Check browser console for analytics logs"
echo "3. Test product viewing and cart actions"
echo "4. Review mock data in dev tools"
