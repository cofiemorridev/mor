#!/bin/bash
cd /workspaces/mor/coconut-oil-ecommerce && \
echo "🔍 QUICK PROJECT CHECK" && \
echo "=====================" && \
echo "" && \
echo "1. Nested folder check:" && \
([ ! -d "frontend/frontend" ] && echo "  ✅ No nested folder" || echo "  ❌ HAS frontend/frontend/") && \
echo "" && \
echo "2. Essential files:" && \
([ -f "frontend/src/main.jsx" ] && echo "  ✅ main.jsx" || echo "  ❌ main.jsx") && \
([ -f "frontend/src/App.jsx" ] && echo "  ✅ App.jsx" || echo "  ❌ App.jsx") && \
([ -f "frontend/package.json" ] && echo "  ✅ package.json" || echo "  ❌ package.json") && \
echo "" && \
echo "3. Context files (Phase 9):" && \
ctx_count=$(find frontend/src/context -name "*.jsx" 2>/dev/null | wc -l) && \
echo "  Contexts: $ctx_count" && \
echo "" && \
echo "4. Services:" && \
(timeout 1 curl -s http://localhost:5173 > /dev/null && echo "  ✅ Frontend: http://localhost:5173" || echo "  ❌ Frontend down") && \
(timeout 1 curl -s http://localhost:5000/api/health > /dev/null && echo "  ✅ Backend: http://localhost:5000/api/health" || echo "  ❌ Backend down") && \
echo "" && \
echo "📊 Status: $([ -f "frontend/src/main.jsx" ] && [ -f "frontend/src/App.jsx" ] && [ ! -d "frontend/frontend" ] && echo "✅ READY" || echo "⚠️ NEEDS FIX")"
