#!/bin/bash

echo "🔍 COMPREHENSIVE PROJECT STRUCTURE VERIFICATION"
echo "==============================================="
echo "Checking: coconut-oil-ecommerce project"
echo "Date: $(date)"
echo ""

cd /workspaces/mor/coconut-oil-ecommerce

echo "📊 OVERVIEW:"
echo "============"
echo "Current directory: $(pwd)"
echo ""

echo "1. ROOT DIRECTORY STRUCTURE:"
echo "============================"
echo "Root contains:"
ls -la | grep -v "^total" | awk '{print $9}' | sort | column -c 80

echo ""
echo "2. FRONTEND STRUCTURE (MOST IMPORTANT):"
echo "======================================="
echo "Checking frontend/ folder..."
if [ -d "frontend" ]; then
    echo "✅ frontend/ exists"
    
    # Check for nested frontend folder (common issue)
    if [ -d "frontend/frontend" ]; then
        echo "❌ CRITICAL: Nested frontend/frontend folder exists!"
        echo "   This will cause build issues."
    else
        echo "✅ No nested frontend folder"
    fi
    
    echo ""
    echo "Frontend root files:"
    ls -la frontend/ | grep -v "^total" | grep -v "^d" | awk '{print "  " $9}' | head -15
    
    echo ""
    echo "Frontend directories:"
    ls -la frontend/ | grep -v "^total" | grep "^d" | awk '{print "  " $9}'
    
    echo ""
    echo "3. FRONTEND/SRC STRUCTURE:"
    echo "=========================="
    if [ -d "frontend/src" ]; then
        echo "✅ frontend/src/ exists"
        echo ""
        
        echo "Essential files in src/:"
        declare -A src_files=(
            ["main.jsx"]="React entry point"
            ["App.jsx"]="Main App component"
            ["index.css"]="Global styles"
        )
        
        for file in "${!src_files[@]}"; do
            if [ -f "frontend/src/$file" ]; then
                lines=$(wc -l < "frontend/src/$file" 2>/dev/null || echo "0")
                echo "  ✅ $file - ${src_files[$file]} ($lines lines)"
            else
                echo "  ❌ $file - ${src_files[$file]} (MISSING!)"
            fi
        done
        
        echo ""
        echo "Subdirectories in src/:"
        find frontend/src -maxdepth 1 -type d | grep -v "^frontend/src$" | sort | while read dir; do
            dir_name=$(basename "$dir")
            file_count=$(find "$dir" -name "*.jsx" -o -name "*.js" -o -name "*.css" 2>/dev/null | wc -l)
            echo "  📁 $dir_name/ ($file_count files)"
        done
        
        echo ""
        echo "File counts by type in src/:"
        echo "  .jsx files: $(find frontend/src -name "*.jsx" 2>/dev/null | wc -l)"
        echo "  .js files: $(find frontend/src -name "*.js" 2>/dev/null | wc -l)"
        echo "  .css files: $(find frontend/src -name "*.css" 2>/dev/null | wc -l)"
        
    else
        echo "❌ CRITICAL: frontend/src/ does not exist!"
    fi
else
    echo "❌ CRITICAL: frontend/ folder does not exist!"
fi

echo ""
echo "4. BACKEND STRUCTURE:"
echo "====================="
if [ -d "backend" ]; then
    echo "✅ backend/ exists"
    echo "  Files: $(find backend -type f -name "*.js" -o -name "*.json" 2>/dev/null | wc -l)"
    echo "  Directories: $(find backend -type d 2>/dev/null | wc -l)"
else
    echo "⚠️ backend/ folder not found (might be expected)"
fi

echo ""
echo "5. CONFIGURATION FILES CHECK:"
echo "============================="
declare -A config_files=(
    ["frontend/package.json"]="Frontend dependencies"
    ["frontend/vite.config.js"]="Vite build config"
    ["frontend/index.html"]="HTML entry point"
    ["frontend/tailwind.config.js"]="Tailwind CSS config"
    ["frontend/postcss.config.js"]="PostCSS config"
    [".env.example"]="Environment example"
)

for file in "${!config_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file" 2>/dev/null || echo "0")
        if [ "$size" -gt 50 ]; then
            echo "  ✅ $file - ${config_files[$file]}"
        else
            echo "  ⚠️  $file - ${config_files[$file]} (small: $size bytes)"
        fi
    else
        echo "  ❌ $file - ${config_files[$file]} (missing)"
    fi
done

echo ""
echo "6. BUILD SYSTEM CHECK:"
echo "======================"
if [ -f "frontend/package.json" ]; then
    echo "Checking package.json scripts:"
    if grep -q '"dev"' frontend/package.json; then
        echo "  ✅ dev script found"
    else
        echo "  ❌ dev script missing"
    fi
    
    if grep -q '"build"' frontend/package.json; then
        echo "  ✅ build script found"
    else
        echo "  ❌ build script missing"
    fi
    
    echo ""
    echo "Key dependencies check:"
    deps=("react" "react-dom" "react-router-dom" "vite" "tailwindcss")
    for dep in "${deps[@]}"; do
        if grep -q "\"$dep\"" frontend/package.json; then
            echo "  ✅ $dep"
        else
            echo "  ⚠️  $dep (not in package.json)"
        fi
    done
else
    echo "❌ Cannot check build system: package.json missing"
fi

echo ""
echo "7. SERVICE HEALTH CHECK:"
echo "========================"
echo "Testing if services are running..."

backend_ok=false
frontend_ok=false

# Check backend
if timeout 2 curl -s http://localhost:5000/api/health > /dev/null; then
    echo "  ✅ Backend: http://localhost:5000/api/health"
    backend_ok=true
else
    echo "  ❌ Backend not responding"
fi

# Check frontend
if timeout 2 curl -s http://localhost:5173 > /dev/null; then
    echo "  ✅ Frontend: http://localhost:5173"
    frontend_ok=true
else
    echo "  ❌ Frontend not responding"
fi

echo ""
echo "8. CRITICAL ISSUES SUMMARY:"
echo "==========================="
critical_issues=0

# Check for nested frontend
if [ -d "frontend/frontend" ]; then
    echo "❌ CRITICAL: Nested frontend/frontend folder"
    critical_issues=$((critical_issues + 1))
fi

# Check for src folder
if [ ! -d "frontend/src" ]; then
    echo "❌ CRITICAL: frontend/src folder missing"
    critical_issues=$((critical_issues + 1))
fi

# Check for main.jsx
if [ ! -f "frontend/src/main.jsx" ]; then
    echo "❌ CRITICAL: frontend/src/main.jsx missing"
    critical_issues=$((critical_issues + 1))
fi

# Check for App.jsx
if [ ! -f "frontend/src/App.jsx" ]; then
    echo "❌ CRITICAL: frontend/src/App.jsx missing"
    critical_issues=$((critical_issues + 1))
fi

# Check for package.json
if [ ! -f "frontend/package.json" ]; then
    echo "❌ CRITICAL: frontend/package.json missing"
    critical_issues=$((critical_issues + 1))
fi

if [ $critical_issues -eq 0 ]; then
    echo "✅ No critical issues found"
else
    echo "⚠️  Found $critical_issues critical issue(s)"
fi

echo ""
echo "9. PROJECT SIZE AND STATS:"
echo "=========================="
echo "Total project size:"
du -sh . 2>/dev/null | cut -f1
echo ""
echo "Frontend size:"
du -sh frontend 2>/dev/null | cut -f1 2>/dev/null || echo "N/A"
echo ""
echo "File type distribution in frontend/src/:"
echo "  React components (.jsx): $(find frontend/src -name "*.jsx" 2>/dev/null | wc -l)"
echo "  JavaScript files (.js): $(find frontend/src -name "*.js" 2>/dev/null | wc -l)"
echo "  Style files (.css): $(find frontend/src -name "*.css" 2>/dev/null | wc -l)"
echo "  Total files: $(find frontend/src -type f 2>/dev/null | wc -l)"

echo ""
echo "📊 FINAL ASSESSMENT:"
echo "==================="
echo "Based on Phase 8.4 & 9 implementation, your project should have:"
echo ""
echo "✅ ESSENTIAL (MUST HAVE):"
echo "   - frontend/src/main.jsx (React entry)"
echo "   - frontend/src/App.jsx (Main App)"
echo "   - frontend/src/context/ (Context providers)"
echo "   - frontend/src/components/ (React components)"
echo "   - frontend/package.json with scripts"
echo "   - frontend/vite.config.js"
echo ""
echo "✅ PHASE 8.4 FEATURES (Analytics):"
echo "   - frontend/src/utils/analytics.js"
echo "   - frontend/src/context/AnalyticsContext.jsx"
echo "   - frontend/src/hooks/useAnalytics.js"
echo ""
echo "✅ PHASE 9 FEATURES (Context & State):"
echo "   - frontend/src/context/CartContext.jsx"
echo "   - frontend/src/context/UserContext.jsx"
echo "   - frontend/src/context/ProductsContext.jsx"
echo "   - frontend/src/context/AppContext.jsx"
echo "   - Shopping cart components"
echo "   - User authentication components"
echo ""
echo "🔗 Quick commands to fix common issues:"
echo "--------------------------------------"
echo "1. If nested frontend: rm -rf frontend/frontend"
echo "2. If missing main.jsx: create it in frontend/src/"
echo "3. If missing dependencies: cd frontend && npm install"
echo "4. To restart services: ./stop-all.sh && ./start-all.sh"
echo "5. To view logs: tail -f logs/*.log"
echo ""
echo "🏁 VERIFICATION COMPLETE"
echo "========================"
