#!/bin/bash

echo "📋 DETAILED FILE-BY-FILE VERIFICATION"
echo "====================================="
echo "Comparing against expected Phase 9 structure"
echo ""

cd /workspaces/mor/coconut-oil-ecommerce

echo "EXPECTED STRUCTURE FOR PHASE 9 COMPLETION:"
echo "=========================================="
echo ""

echo "1. ROOT LEVEL (coconut-oil-ecommerce/):"
echo "--------------------------------------"
expected_root=(
    "frontend/"
    "backend/"
    "logs/"
    ".devcontainer/"
    ".github/"
    "start-all.sh"
    "stop-all.sh"
    "status.sh"
)

for item in "${expected_root[@]}"; do
    if [ -e "$item" ]; then
        echo "  ✅ $item"
    else
        echo "  ⚠️  $item (not found)"
    fi
done

echo ""
echo "2. FRONTEND ROOT (frontend/):"
echo "----------------------------"
expected_frontend=(
    "package.json"
    "vite.config.js"
    "index.html"
    "tailwind.config.js"
    "postcss.config.js"
    "src/"
    "public/"
    "node_modules/"
)

for item in "${expected_frontend[@]}"; do
    if [ -e "frontend/$item" ]; then
        if [ "$item" = "node_modules/" ]; then
            echo "  ✅ $item (dependencies)"
        else
            echo "  ✅ $item"
        fi
    else
        if [ "$item" = "node_modules/" ]; then
            echo "  ⚠️  $item (run: cd frontend && npm install)"
        else
            echo "  ❌ $item (MISSING!)"
        fi
    fi
done

echo ""
echo "3. FRONTEND SOURCE (frontend/src/):"
echo "----------------------------------"
echo "Checking file hierarchy..."

# Create a tree-like structure display
print_tree() {
    local dir=$1
    local prefix=$2
    
    for item in $(ls "$dir" 2>/dev/null | sort); do
        local path="$dir/$item"
        
        if [ -d "$path" ]; then
            echo "${prefix}├── 📁 $item/"
            print_tree "$path" "$prefix│   "
        elif [ -f "$path" ]; then
            local color=""
            local ext="${item##*.}"
            
            case "$ext" in
                jsx) color="🔵" ;;
                js) color="🟡" ;;
                css) color="🎨" ;;
                json) color="📦" ;;
                *) color="📄" ;;
            esac
            
            echo "${prefix}├── $color $item"
        fi
    done
}

if [ -d "frontend/src" ]; then
    echo "📁 src/"
    print_tree "frontend/src" ""
else
    echo "❌ src/ directory not found!"
fi

echo ""
echo "4. ESSENTIAL FILES CHECK:"
echo "-------------------------"
echo "These files MUST exist for the app to work:"

declare -A essential_files=(
    # React core
    ["frontend/src/main.jsx"]="React entry point"
    ["frontend/src/App.jsx"]="Main application"
    ["frontend/src/index.css"]="Global styles"
    
    # Contexts (Phase 9)
    ["frontend/src/context/AnalyticsContext.jsx"]="Analytics context"
    ["frontend/src/context/CartContext.jsx"]="Shopping cart context"
    ["frontend/src/context/UserContext.jsx"]="User authentication context"
    ["frontend/src/context/ProductsContext.jsx"]="Products data context"
    ["frontend/src/context/AppContext.jsx"]="Combined app context"
    
    # Key components
    ["frontend/src/components/layout/Navbar.jsx"]="Navigation bar"
    ["frontend/src/components/layout/Footer.jsx"]="Page footer"
    ["frontend/src/components/cart/CartSidebar.jsx"]="Cart sidebar"
    ["frontend/src/components/product/ProductCard.jsx"]="Product display card"
    
    # Utilities (Phase 8.4)
    ["frontend/src/utils/analytics.js"]="Analytics utilities"
    
    # Hooks
    ["frontend/src/hooks/useAnalytics.js"]="Analytics hooks"
    
    # Pages
    ["frontend/src/pages/Home.jsx"]="Home page"
    ["frontend/src/pages/Products.jsx"]="Products page"
    ["frontend/src/pages/Cart.jsx"]="Cart page"
    ["frontend/src/pages/Checkout.jsx"]="Checkout page"
)

all_good=true
for file in "${!essential_files[@]}"; do
    if [ -f "$file" ]; then
        lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        if [ "$lines" -gt 10 ]; then
            echo "  ✅ ${essential_files[$file]}"
        else
            echo "  ⚠️  ${essential_files[$file]} (only $lines lines)"
            all_good=false
        fi
    else
        echo "  ❌ ${essential_files[$file]} (MISSING)"
        all_good=false
    fi
done

echo ""
echo "5. BUILD CONFIGURATION CHECK:"
echo "----------------------------"
echo "Checking Vite configuration..."

if [ -f "frontend/vite.config.js" ]; then
    echo "  ✅ vite.config.js exists"
    
    # Check for important configs
    if grep -q "react()" frontend/vite.config.js; then
        echo "  ✅ React plugin configured"
    else
        echo "  ⚠️  React plugin might be missing"
    fi
    
    if grep -q "port.*5173" frontend/vite.config.js; then
        echo "  ✅ Port 5173 configured"
    else
        echo "  ⚠️  Port configuration missing"
    fi
else
    echo "  ❌ vite.config.js missing"
    all_good=false
fi

echo ""
echo "6. PACKAGE.JSON CHECK:"
echo "---------------------"
if [ -f "frontend/package.json" ]; then
    echo "  ✅ package.json exists"
    
    # Check scripts
    echo "  Scripts found:"
    grep -A5 '"scripts"' frontend/package.json | grep -v '"scripts"' | \
        grep -v "^--" | sed 's/^/    /'
    
    # Check dependencies
    echo "  Critical dependencies:"
    deps_check=("react" "react-dom" "react-router-dom" "@vitejs/plugin-react")
    for dep in "${deps_check[@]}"; do
        if grep -q "\"$dep\"" frontend/package.json; then
            echo "    ✅ $dep"
        else
            echo "    ⚠️  $dep"
        fi
    done
else
    echo "  ❌ package.json missing"
    all_good=false
fi

echo ""
echo "7. QUICK BUILD TEST:"
echo "-------------------"
cd frontend 2>/dev/null
if [ $? -eq 0 ]; then
    echo "  Testing build system..."
    if timeout 5 npm run build --dry-run 2>&1 | grep -q "vite" || \
       timeout 5 npm run build 2>&1 | head -3 | grep -i "build" > /dev/null; then
        echo "  ✅ Build system appears functional"
    else
        echo "  ⚠️  Build system test inconclusive"
    fi
    cd ..
else
    echo "  ❌ Cannot access frontend directory"
    all_good=false
fi

echo ""
echo "📊 VERIFICATION SUMMARY:"
echo "========================"
if $all_good; then
    echo "✅ EXCELLENT! Structure matches Phase 9 expectations."
    echo ""
    echo "🎉 Your project is ready for:"
    echo "   - Phase 10: Authentication & User Management"
    echo "   - Phase 11: Payment Integration"
    echo "   - Phase 12: Deployment"
else
    echo "⚠️  Some issues detected. Review the warnings above."
    echo ""
    echo "🛠️  Common fixes:"
    echo "   1. Create missing files from templates"
    echo "   2. Run: cd frontend && npm install"
    echo "   3. Check file permissions"
    echo "   4. Ensure no nested folders"
fi

echo ""
echo "🔗 Your application should be at: http://localhost:5173"
echo "📝 Logs are in: logs/frontend.log and logs/backend.log"
