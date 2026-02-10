#!/bin/bash

echo "🔍 VERIFICATION OF MAIN.JSX FIX"
echo "================================"

cd /workspaces/mor/coconut-oil-ecommerce

echo ""
echo "1. Checking critical files:"
echo "---------------------------"
critical_files=(
    "frontend/src/main.jsx"
    "frontend/src/index.css"
    "frontend/src/App.jsx"
    "frontend/src/utils/analytics.js"
    "frontend/index.html"
    "frontend/package.json"
    "frontend/vite.config.js"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file" 2>/dev/null || echo "0")
        if [ "$size" -gt 10 ]; then
            echo "✅ $file ($size bytes)"
        else
            echo "⚠️  $file (too small: $size bytes)"
        fi
    else
        echo "❌ $file (missing)"
    fi
done

echo ""
echo "2. Checking Vite error log:"
echo "--------------------------"
if grep -q "Failed to load url /src/main.jsx" logs/frontend.log 2>/dev/null; then
    echo "❌ Vite still cannot find main.jsx"
    echo "   Check: ls -la frontend/src/main.jsx"
else
    echo "✅ No main.jsx errors in log"
fi

echo ""
echo "3. Testing application:"
echo "----------------------"
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Application is running"
    
    # Check if we get a proper HTML response
    if curl -s http://localhost:5173 | grep -q "<title>"; then
        echo "✅ HTML is being served correctly"
    else
        echo "⚠️  HTML might not be loading properly"
    fi
else
    echo "❌ Application not responding"
fi

echo ""
echo "4. File structure:"
echo "-----------------"
echo "frontend/src/ contains:"
ls -la frontend/src/ | grep -v "^total"

echo ""
echo "📊 SUMMARY:"
echo "=========="
echo "If you see ✅ for all checks, the fix is complete."
echo "If you see ❌, there are still issues to resolve."
echo ""
echo "🛠️  Quick fixes:"
echo "1. Ensure main.jsx exists: ls -la frontend/src/main.jsx"
echo "2. Check Vite config: cat frontend/vite.config.js"
echo "3. Restart services: ./stop-all.sh && ./start-all.sh"
