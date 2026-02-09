#!/bin/bash

echo "🔍 SEO OPTIMIZATION TEST"
echo "=======================\n"

echo "1. Testing sitemap generation..."
if curl -s http://localhost:5000/sitemap/sitemap.xml | grep -q "sitemap"; then
  echo "✅ Sitemap generated successfully"
else
  echo "❌ Sitemap generation failed"
fi

echo -e "\n2. Testing robots.txt..."
if curl -s http://localhost:5000/robots.txt | grep -q "Sitemap"; then
  echo "✅ robots.txt generated successfully"
else
  echo "❌ robots.txt generation failed"
fi

echo -e "\n3. Testing product sitemap..."
if curl -s http://localhost:5000/sitemap/products.xml | grep -q "sitemap"; then
  echo "✅ Product sitemap generated successfully"
else
  echo "❌ Product sitemap generation failed"
fi

echo -e "\n4. Testing backend health..."
if curl -s http://localhost:5000/api/health | grep -q "ok"; then
  echo "✅ Backend is healthy"
else
  echo "❌ Backend health check failed"
fi

echo -e "\n5. Testing frontend access..."
if curl -s http://localhost:5173 > /dev/null; then
  echo "✅ Frontend is accessible"
else
  echo "❌ Frontend is not accessible"
fi

echo -e "\n🎯 SYSTEM STATUS SUMMARY"
echo "========================"
echo "Backend: $(curl -s http://localhost:5000/api/health | grep -q "ok" && echo "✅ RUNNING" || echo "❌ STOPPED")"
echo "Frontend: $(curl -s http://localhost:5173 > /dev/null && echo "✅ RUNNING" || echo "❌ STOPPED")"
echo "Sitemap: $(curl -s http://localhost:5000/sitemap/sitemap.xml > /dev/null && echo "✅ AVAILABLE" || echo "❌ UNAVAILABLE")"
echo "Robots.txt: $(curl -s http://localhost:5000/robots.txt > /dev/null && echo "✅ AVAILABLE" || echo "❌ UNAVAILABLE")"
