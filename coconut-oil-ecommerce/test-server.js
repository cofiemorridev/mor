const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle root path
  if (req.url === '/' || req.url === '/index.html') {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Coconut Oil Store</title>
      <style>
        body {
          margin: 0;
          padding: 40px;
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #2d5016, #4a7c2c);
          color: white;
          text-align: center;
          min-height: 100vh;
        }
        h1 { font-size: 3em; margin-bottom: 20px; }
        .box {
          background: white;
          color: #2d5016;
          padding: 30px;
          border-radius: 10px;
          margin: 30px auto;
          max-width: 600px;
          text-align: left;
        }
        .success {
          background: #4CAF50;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          display: inline-block;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <h1>🥥 Coconut Oil Store</h1>
      <div class="success">✅ SERVER IS RUNNING!</div>
      <div class="box">
        <h2>Server Information</h2>
        <p><strong>URL:</strong> ${req.headers.host}</p>
        <p><strong>Time:</strong> <span id="time">${new Date().toLocaleTimeString()}</span></p>
        <p><strong>Port:</strong> 5174</p>
        <p><strong>Status:</strong> Active and responding</p>
      </div>
      <div class="box">
        <h2>Next Steps</h2>
        <ol>
          <li>Check browser console for errors (F12)</li>
          <li>Verify Vite server is running on port 5174</li>
          <li>Access the React app at: <a href="http://${req.headers.host}" style="color: #2d5016; font-weight: bold;">http://${req.headers.host}</a></li>
        </ol>
      </div>
    </body>
    </html>
    `;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }
  
  // Handle 404
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 - Page Not Found</h1><p>Go to <a href="/">home page</a></p>');
});

const PORT = 5174;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ Local: http://localhost:${PORT}`);
  console.log(`✅ Network: http://[YOUR-IP]:${PORT}`);
  console.log(`\n📢 Open your browser and visit: http://localhost:${PORT}`);
});
