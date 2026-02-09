#!/bin/bash

echo "🛑 STOPPING ALL SERVICES..."
echo "==========================="

# Kill by PID files first
for pid_file in /tmp/Backend_pid /tmp/Frontend_pid; do
    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file")
        echo "Stopping PID $pid from $pid_file..."
        kill $pid 2>/dev/null && echo "✅ Stopped" || echo "⚠️  Already stopped"
        rm "$pid_file"
    fi
done

# Kill by port
for port in 5000 5173; do
    pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo "Killing processes on port $port: $pids"
        kill -9 $pids 2>/dev/null
    fi
done

echo "✅ All services stopped"
