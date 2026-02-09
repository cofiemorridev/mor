#!/bin/bash

echo "🔍 SERVICE STATUS"
echo "================"

check_service() {
    local port=$1
    local name=$2
    local url=$3
    
    echo -n "$name (port $port): "
    
    # Check if process is running on port
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        # Try to access the service
        if timeout 3 curl -s "$url" > /dev/null; then
            echo "✅ RUNNING & RESPONSIVE"
            return 0
        else
            echo "⚠️  RUNNING BUT UNRESPONSIVE"
            return 1
        fi
    else
        echo "❌ NOT RUNNING"
        return 1
    fi
}

check_service 5000 "Backend API" "http://localhost:5000/api/health"
check_service 5173 "Frontend App" "http://localhost:5173"

echo ""
echo "📊 SYSTEM READINESS FOR PHASE 8.4"
echo "================================"

if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null && \
   lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null; then
    echo "✅ READY for Analytics Integration!"
    echo ""
    echo "You can proceed with Phase 8.4 to add:"
    echo "• Google Analytics tracking"
    echo "• Performance monitoring"
    echo "• User behavior analytics"
    echo "• Conversion tracking"
else
    echo "❌ NOT READY - Fix services first"
    echo ""
    echo "Run: ./start-all.sh to start services"
fi

echo ""
echo "🔗 QUICK LINKS:"
echo "   http://localhost:5173          - Store"
echo "   http://localhost:5173/admin/login - Admin"
echo "   http://localhost:5000/api/health  - API Status"
