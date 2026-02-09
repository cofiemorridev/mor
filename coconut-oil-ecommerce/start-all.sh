#!/bin/bash

echo "🥥 COCONUT OIL E-COMMERCE - RESILIENT STARTUP"
echo "============================================="
echo "Starting at: $(date)"
echo ""

# Create logs directory if it doesn't exist
mkdir -p logs

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to start service with retries
start_service() {
    local name=$1
    local dir=$2
    local cmd=$3
    local port=$4
    local log_file="logs/${name,,}.log"
    local max_retries=3
    local retry_count=0
    
    echo "🚀 Starting $name..."
    
    while [ $retry_count -lt $max_retries ]; do
        # Check if port is already in use
        if check_port $port; then
            echo "   ⚠️  Port $port already in use, killing..."
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
            sleep 2
        fi
        
        echo "   Attempt $(($retry_count + 1))/$max_retries..."
        
        # Check if directory exists
        if [ ! -d "$dir" ]; then
            echo "   ❌ Directory '$dir' does not exist!"
            return 1
        fi
        
        echo "   Directory: $dir"
        echo "   Command: $cmd"
        echo "   Log file: $log_file"
        
        # Change to directory and start service
        (cd "$dir" && eval "$cmd" > "../$log_file" 2>&1) &
        local pid=$!
        echo $pid > "/tmp/${name}_pid"
        
        # Wait for service to start
        echo "   ⏳ Waiting for $name to start on port $port..."
        local timeout=15
        local start_time=$(date +%s)
        local service_started=false
        
        while [ $(($(date +%s) - start_time)) -lt $timeout ]; do
            if check_port $port; then
                service_started=true
                break
            fi
            sleep 1
        done
        
        if [ "$service_started" = true ]; then
            echo "   ✅ $name started successfully (PID: $pid)"
            echo "   📝 Logs: $log_file"
            return 0
        else
            # Service didn't start, kill it and retry
            echo "   ❌ $name failed to start within $timeout seconds"
            kill $pid 2>/dev/null || true
            retry_count=$((retry_count + 1))
            sleep 2
        fi
    done
    
    echo "   💥 Failed to start $name after $max_retries attempts"
    echo "   🔍 Check the log file: $log_file"
    if [ -f "$log_file" ]; then
        echo "   Last 10 lines of log:"
        tail -10 "$log_file"
    fi
    return 1
}

# Stop any existing services first
echo "🛑 Stopping any existing services..."
for port in 5000 5173; do
    if check_port $port; then
        echo "   Killing processes on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
    fi
done

# Start backend
if start_service "Backend" "backend" "npm start" "5000"; then
    echo "✅ Backend startup initiated"
else
    echo "❌ Backend failed to start"
fi

# Start frontend
if start_service "Frontend" "frontend" "npm run dev" "5173"; then
    echo "✅ Frontend startup initiated"
else
    echo "❌ Frontend failed to start"
fi

# Wait a bit for services to stabilize
echo ""
echo "⏳ Waiting for services to stabilize..."
sleep 5

# Run health checks
echo ""
echo "🔍 RUNNING HEALTH CHECKS..."
echo "==========================="

check_health() {
    local url=$1
    local name=$2
    local max_attempts=5
    local attempt=1
    
    echo -n "   Testing $name: "
    
    while [ $attempt -le $max_attempts ]; do
        if timeout 3 curl -s -f "$url" > /dev/null; then
            echo "✅ HEALTHY"
            return 0
        fi
        
        if [ $attempt -lt $max_attempts ]; then
            sleep 2
        fi
        attempt=$((attempt + 1))
    done
    
    echo "❌ UNHEALTHY"
    return 1
}

check_health "http://localhost:5000/api/health" "Backend API"
check_health "http://localhost:5173" "Frontend App"

echo ""
echo "🎯 STATUS SUMMARY"
echo "================"

if check_port 5000 && check_port 5173; then
    echo "✅ Both services are running!"
    echo ""
    echo "🔗 ACCESS LINKS:"
    echo "   Store:      http://localhost:5173"
    echo "   Admin:      http://localhost:5173/admin/login"
    echo "   API Health: http://localhost:5000/api/health"
    echo "   API Docs:   http://localhost:5000/api/test"
    echo ""
    echo "📊 READY FOR PHASE 8.4: ANALYTICS INTEGRATION"
    echo "============================================"
    echo "All systems go! You can now proceed to add:"
    echo "1. Google Analytics"
    echo "2. Performance monitoring"
    echo "3. User behavior tracking"
    echo "4. Conversion tracking"
else
    echo "⚠️  Some services may not be running properly"
    echo ""
    echo "🔧 TROUBLESHOOTING:"
    echo "   1. Check log files:"
    echo "      - logs/backend.log"
    echo "      - logs/frontend.log"
    echo "   2. Run: ./start-all.sh again"
    echo "   3. Check if ports 5000 and 5173 are free"
fi

echo ""
echo "📋 QUICK COMMANDS:"
echo "   ./start-all.sh          - Start all services"
echo "   ./stop-all.sh           - Stop all services"
echo "   ./status.sh             - Check service status"
echo "   tail -f logs/*.log      - View live logs"
echo ""
echo "💡 Tip: If Codespace disconnects, just run ./start-all.sh to restart"
