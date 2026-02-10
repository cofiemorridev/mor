# How to Access Your Coconut Oil Store

## If Vite server is running on port 5174:

1. **In Codespaces:**
   - Go to the "Ports" tab
   - Find port 5174
   - Click the globe icon 🌐
   - OR use: https://obscure-pancake-[YOUR-CODESPACE]-5174.app.github.dev

2. **If port 5174 doesn't appear:**
   - Stop the server (Ctrl+C)
   - Run: `./start.sh`
   - Wait for "Local: http://localhost:5174" message
   - Check Ports tab again

3. **Alternative ports to try:**
   - 5173 (original)
   - 5174 (new)
   - 3000 (common React port)
   - 8080 (common dev port)

4. **Troubleshooting:**
   - Run: `lsof -i :5174` to check if port is listening
   - Run: `curl -I http://localhost:5174` to test connection
   - Check browser console (F12) for errors

## Quick Test URLs:
- Simple test: http://localhost:5174/simple-test.html
- React app: http://localhost:5174/
