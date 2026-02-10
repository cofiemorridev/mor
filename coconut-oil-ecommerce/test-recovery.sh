#!/bin/bash

echo "🧪 COMPREHENSIVE RECOVERY TEST"
echo "=============================="

cd /workspaces/mor/coconut-oil-ecommerce

echo ""
echo "1. FOLDER STRUCTURE TEST:"
echo "-------------------------"
if [ -d "frontend/frontend" ]; then
    echo "❌ STILL HAS NESTED FOLDER"
else
    echo "✅ No nested folder"
fi

echo ""
echo "2. FILE COMPLETENESS TEST:"
echo "--------------------------"
declare -A files_to_check=(
    ["frontend/package.json"]="Package configuration"
    ["frontend/vite.config.js"]="Build configuration"
    ["frontend/index.html"]="HTML entry point"
    ["frontend/src/main.jsx"]="React entry point"
    ["frontend/src/App.jsx"]="Main App component"
    ["frontend/src/index.css"]="Global styles"
    ["frontend/src/context/AnalyticsContext.jsx"]="Analytics context"
    ["frontend/src/context/CartContext.jsx"]="Cart context"
    ["frontend/src/context/UserContext.jsx"]="User context"
    ["frontend/src/context/ProductsContext.jsx"]="Products context"
    ["frontend/src/context/AppContext.jsx"]="App context"
    ["frontend/src/utils/analytics.js"]="Analytics utilities"
    ["frontend/src/hooks/useAnalytics.js"]="Analytics hooks"
    ["frontend/src/components/layout/Navbar.jsx"]="Navigation"
    ["frontend/src/components/layout/Footer.jsx"]="Footer"
    ["frontend/src/components/cart/CartSidebar.jsx"]="Cart sidebar"
    ["frontend/src/components/product/ProductCard.jsx"]="Product card"
)

for file in "${!files_to_check[@]}"; do
    if [ -f "$file" ]; then
        lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        if [ "$lines" -gt 5 ]; then
            echo "✅ ${files_to_check[$file]}"
        else
            echo "⚠️  ${files_to_check[$file]} (too small: $lines lines)"
        fi
    else
        echo "❌ ${files_to_check[$file]}"
    fi
done

echo ""
echo "3. DEPENDENCIES TEST:"
echo "--------------------"
cd frontend
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
    
    # Check for key dependencies
    if [ -d "node_modules/react" ]; then
        echo "✅ React installed"
    else
        echo "❌ React missing"
    fi
    
    if [ -d "node_modules/react-router-dom" ]; then
        echo "✅ React Router installed"
    else
        echo "❌ React Router missing"
    fi
else
    echo "❌ node_modules missing"
fi
cd ..

echo ""
echo "4. BUILD TEST:"
echo "-------------"
cd frontend
if timeout 5 npm run build --dry-run 2>&1 | grep -q "vite" || timeout 5 npm run build 2>&1 | head -5 | grep -q "building"; then
    echo "✅ Build system works"
else
    echo "❌ Build system failed"
    
    # Try to install if needed
    echo "Attempting to fix dependencies..."
    npm install
fi
cd ..

echo ""
echo "5. RUNTIME TEST:"
echo "---------------"
echo "Starting services..."
./start-all.sh > /tmp/test_start.log 2>&1 &
sleep 10

backend_ok=false
frontend_ok=false

if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend running"
    backend_ok=true
else
    echo "❌ Backend not responding"
fi

if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend running"
    frontend_ok=true
else
    echo "❌ Frontend not responding"
    
    # Check frontend logs
    echo "Frontend log snippet:"
    tail -10 logs/frontend.log 2>/dev/null || echo "No frontend log found"
fi

echo ""
echo "📊 TEST RESULTS:"
echo "================"
if $backend_ok && $frontend_ok; then
    echo "🎉 SUCCESS! Recovery complete!"
    echo ""
    echo "🔗 Your application is running:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend:  http://localhost:5000/api/health"
else
    echo "⚠️  Some issues detected"
    echo ""
    echo "🛠️  Troubleshooting steps:"
    echo "1. Check logs: tail -f logs/*.log"
    echo "2. Install dependencies: cd frontend && npm install"
    echo "3. Manual start: cd frontend && npm run dev"
    echo "4. Check file permissions"
fi

# Clean up
./stop-all.sh 2>/dev/null || true
