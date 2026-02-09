#!/bin/bash

echo "🌴 FINAL SYSTEM VERIFICATION - PHASE 8 READINESS"
echo "================================================"
echo "Timestamp: $(date)"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to test with timeout
test_endpoint() {
  local url=$1
  local name=$2
  local timeout=5
  
  echo -n "🔍 $name: "
  
  # Try with timeout
  if timeout $timeout curl -s "$url" > /dev/null; then
    echo -e "${GREEN}✅ OK${NC}"
    return 0
  else
    echo -e "${RED}❌ FAILED${NC}"
    return 1
  fi
}

echo "1. 🔧 BACKEND SERVICE VERIFICATION"
echo "---------------------------------"

# Test backend endpoints
test_endpoint "http://localhost:5000/api/health" "Health Check"
test_endpoint "http://localhost:5000/api/test" "API Test"
test_endpoint "http://localhost:5000/api/products" "Products API"
test_endpoint "http://localhost:5000/api/admin/test" "Admin API"
test_endpoint "http://localhost:5000/api/payment/test" "Payment API"
test_endpoint "http://localhost:5000/sitemap/sitemap.xml" "Sitemap"
test_endpoint "http://localhost:5000/robots.txt" "Robots.txt"

echo -e "\n2. 🎨 FRONTEND SERVICE VERIFICATION"
echo "-----------------------------------"
test_endpoint "http://localhost:5173" "Home Page"
test_endpoint "http://localhost:5173/admin/login" "Admin Login Page"

echo -e "\n3. 🔗 API INTEGRATION TEST"
echo "---------------------------"
echo -n "Fetching product data: "
if curl -s http://localhost:5000/api/products | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Products API returning data${NC}"
  # Show product count
  product_count=$(curl -s http://localhost:5000/api/products | grep -o '"data":\[.*\]' | grep -o '{"id":' | wc -l 2>/dev/null || echo "2")
  echo "   Found approximately $product_count products"
else
  echo -e "${RED}❌ Products API not responding correctly${NC}"
fi

echo -e "\n4. 📊 PERFORMANCE CHECK"
echo "------------------------"
echo "Testing response times (lower is better):"

endpoints=(
  "http://localhost:5000/api/health"
  "http://localhost:5000/api/products"
  "http://localhost:5173"
)

for url in "${endpoints[@]}"; do
  start_time=$(date +%s%3N)
  timeout 3 curl -s "$url" > /dev/null
  end_time=$(date +%s%3N)
  duration=$((end_time - start_time))
  
  if [ "$duration" -lt 100 ]; then
    echo -e "   ${GREEN}✅ $(basename $url): ${duration}ms${NC}"
  elif [ "$duration" -lt 500 ]; then
    echo -e "   ${YELLOW}⚠️  $(basename $url): ${duration}ms${NC}"
  else
    echo -e "   ${RED}❌ $(basename $url): ${duration}ms${NC}"
  fi
done

echo -e "\n5. 📁 PROJECT STRUCTURE CHECK"
echo "------------------------------"
echo "Checking if Phase 8 files exist:"

check_file() {
  local file=$1
  local name=$2
  if [ -f "$file" ]; then
    echo -e "   ${GREEN}✅ $name${NC}"
  else
    echo -e "   ${RED}❌ $name (missing)${NC}"
  fi
}

check_file "src/components/common/SEO.jsx" "SEO Component"
check_file "src/utils/seoUtils.js" "SEO Utilities"
check_file "src/components/common/OptimizedImage.jsx" "OptimizedImage Component"
check_file "vite.config.js" "Vite PWA Config"

echo -e "\n6. 🎯 READINESS FOR PHASE 8.3"
echo "-------------------------------"

# Count successes
backend_success=$(timeout 3 curl -s http://localhost:5000/api/health > /dev/null && echo 1 || echo 0)
frontend_success=$(timeout 3 curl -s http://localhost:5173 > /dev/null && echo 1 || echo 0)
seo_success=$(timeout 3 curl -s http://localhost:5000/sitemap/sitemap.xml > /dev/null && echo 1 || echo 0)

total=$((backend_success + frontend_success + seo_success))

echo -e "\n📈 VERIFICATION SCORE: $total/3"

if [ $total -eq 3 ]; then
  echo -e "\n${GREEN}🎉 ALL SYSTEMS GO! READY FOR PHASE 8.3${NC}"
  echo -e "\n${YELLOW}📋 NEXT: PWA FEATURES IMPLEMENTATION${NC}"
  echo "   • Service Worker for offline support"
  echo "   • Web App Manifest for installability"
  echo "   • Install prompt for mobile"
  echo "   • Push notifications setup"
  echo "   • App shell architecture"
  
  echo -e "\n${GREEN}🔗 ACCESS YOUR APPLICATION:${NC}"
  echo "   Store: http://localhost:5173"
  echo "   Admin: http://localhost:5173/admin/login"
  echo "   API: http://localhost:5000/api/health"
  echo "   Sitemap: http://localhost:5000/sitemap/sitemap.xml"
  
elif [ $total -ge 2 ]; then
  echo -e "\n${YELLOW}⚠️  ALMOST READY - Minor issues detected${NC}"
  echo "Proceeding with Phase 8.3 but may need fixes"
else
  echo -e "\n${RED}❌ NOT READY - Major issues detected${NC}"
  echo "Need to fix services before proceeding"
fi

echo -e "\n📋 CURRENT PROCESSES:"
jobs -l 2>/dev/null || echo "No background jobs found"
