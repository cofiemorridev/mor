const http = require('http');

console.log('🌴 SIMPLE SYSTEM TEST');
console.log('====================');
console.log('Testing at:', new Date().toISOString());
console.log('');

const tests = [
  { name: 'Backend Health', url: 'http://localhost:5000/api/health' },
  { name: 'Frontend Home', url: 'http://localhost:5173' },
  { name: 'Products API', url: 'http://localhost:5000/api/products' },
  { name: 'Sitemap', url: 'http://localhost:5000/sitemap/sitemap.xml' },
  { name: 'Web Manifest', url: 'http://localhost:5173/manifest.json' },
  { name: 'Offline Page', url: 'http://localhost:5173/offline.html' },
  { name: 'Admin Login', url: 'http://localhost:5173/admin/login' }
];

let passed = 0;
let failed = 0;

function testEndpoint(name, url) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.request(url, (res) => {
      const duration = Date.now() - start;
      const icon = res.statusCode >= 200 && res.statusCode < 400 ? '✅' : '❌';
      console.log(`${icon} ${name.padEnd(20)} ${res.statusCode} ${duration}ms`);
      
      if (res.statusCode >= 200 && res.statusCode < 400) {
        passed++;
      } else {
        failed++;
      }
      resolve();
    });
    
    req.on('error', () => {
      console.log(`❌ ${name.padEnd(20)} ERROR`);
      failed++;
      resolve();
    });
    
    req.setTimeout(5000, () => {
      console.log(`❌ ${name.padEnd(20)} TIMEOUT`);
      failed++;
      req.destroy();
      resolve();
    });
    
    req.end();
  });
}

async function runTests() {
  for (const test of tests) {
    await testEndpoint(test.name, test.url);
  }
  
  console.log('\n📊 SUMMARY');
  console.log('=========');
  console.log(`Total Tests: ${tests.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${((passed/tests.length)*100).toFixed(1)}%`);
  
  console.log('\n🎯 RECOMMENDATION:');
  if (passed === tests.length) {
    console.log('✅ ALL TESTS PASSED - Ready for Phase 8.4!');
  } else if (passed >= tests.length * 0.7) {
    console.log('⚠️  MOST TESTS PASSED - Review failures, then proceed');
  } else {
    console.log('❌ MULTIPLE FAILURES - Fix critical issues first');
  }
  
  console.log('\n🔗 QUICK ACCESS:');
  console.log('Store: http://localhost:5173');
  console.log('API: http://localhost:5000/api/health');
}

runTests();
