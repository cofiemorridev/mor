const http = require('http');

console.log('🌴 COCONUT OIL E-COMMERCE - SYSTEM TEST');
console.log('=======================================');
console.log('Testing at:', new Date().toISOString());
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('');

const tests = [
  { name: 'Backend Health', url: 'http://localhost:5000/api/health' },
  { name: 'Frontend Home', url: 'http://localhost:5173' },
  { name: 'Products API', url: 'http://localhost:5000/api/products' },
  { name: 'Products Featured', url: 'http://localhost:5000/api/products/featured' },
  { name: 'Sitemap', url: 'http://localhost:5000/sitemap/sitemap.xml' },
  { name: 'Robots.txt', url: 'http://localhost:5000/robots.txt' },
  { name: 'Web Manifest', url: 'http://localhost:5173/manifest.json' },
  { name: 'Offline Page', url: 'http://localhost:5173/offline.html' },
  { name: 'Admin Login Page', url: 'http://localhost:5173/admin/login' }
];

let passed = 0;
let failed = 0;
let results = [];

function testEndpoint(name, url) {
  return new Promise((resolve) => {
    const start = Date.now();
    const isBackend = url.includes(':5000');
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isBackend ? 5000 : 5173),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Coconut-Oil-Test/1.0'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const duration = Date.now() - start;
        const success = res.statusCode >= 200 && res.statusCode < 400;
        const icon = success ? '✅' : '❌';
        const contentType = res.headers['content-type'] || 'unknown';
        
        console.log(`${icon} ${name.padEnd(25)} ${res.statusCode.toString().padStart(3)} ${duration.toString().padStart(4)}ms ${contentType.split(';')[0]}`);
        
        results.push({
          name,
          success,
          statusCode: res.statusCode,
          duration,
          contentType,
          data: data.substring(0, 100)
        });
        
        if (success) {
          passed++;
        } else {
          failed++;
        }
        resolve();
      });
    });
    
    req.on('error', (err) => {
      const duration = Date.now() - start;
      console.log(`❌ ${name.padEnd(25)} ERROR ${duration}ms (${err.code || err.message})`);
      
      results.push({
        name,
        success: false,
        statusCode: 0,
        duration,
        contentType: 'error',
        error: err.message
      });
      
      failed++;
      resolve();
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      const duration = Date.now() - start;
      console.log(`❌ ${name.padEnd(25)} TIMEOUT ${duration}ms`);
      
      results.push({
        name,
        success: false,
        statusCode: 0,
        duration,
        contentType: 'timeout',
        error: 'Request timeout'
      });
      
      failed++;
      resolve();
    });
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 RUNNING TESTS...');
  console.log('='.repeat(60));
  
  for (const test of tests) {
    await testEndpoint(test.name, test.url);
  }
  
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${tests.length}`);
  console.log(`Passed: ${passed} (${((passed/tests.length)*100).toFixed(1)}%)`);
  console.log(`Failed: ${failed} (${((failed/tests.length)*100).toFixed(1)}%)`);
  
  console.log('\n🔍 DETAILED ANALYSIS');
  console.log('='.repeat(60));
  
  // Critical system checks
  const backendHealth = results.find(r => r.name === 'Backend Health');
  const frontendHome = results.find(r => r.name === 'Frontend Home');
  const productsAPI = results.find(r => r.name === 'Products API');
  
  console.log('\n🎯 CRITICAL COMPONENTS:');
  console.log(`Backend API: ${backendHealth?.success ? '✅ HEALTHY' : '❌ FAILED'}`);
  console.log(`Frontend App: ${frontendHome?.success ? '✅ LOADING' : '❌ FAILED'}`);
  console.log(`Products Data: ${productsAPI?.success ? '✅ AVAILABLE' : '❌ UNAVAILABLE'}`);
  
  // SEO Features
  const seoTests = results.filter(r => 
    r.name.includes('Sitemap') || r.name.includes('Robots')
  );
  const seoPassed = seoTests.filter(r => r.success).length;
  console.log(`\n🔍 SEO Features: ${seoPassed}/${seoTests.length} working`);
  
  // PWA Features
  const pwaTests = results.filter(r => 
    r.name.includes('Manifest') || r.name.includes('Offline')
  );
  const pwaPassed = pwaTests.filter(r => r.success).length;
  console.log(`📱 PWA Features: ${pwaPassed}/${pwaTests.length} working`);
  
  // Performance
  const avgResponseTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  console.log(`⚡ Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
  
  console.log('\n🎯 RECOMMENDATION:');
  if (passed === tests.length) {
    console.log('🚀 EXCELLENT! All systems ready for Phase 8.4: Analytics Integration');
    console.log('   Proceed with confidence!');
  } else if (passed >= tests.length * 0.8) {
    console.log('⚠️  GOOD! Minor issues detected');
    console.log('   Review failures below, then proceed to Phase 8.4');
  } else if (passed >= tests.length * 0.6) {
    console.log('🔧 FAIR! Some issues need attention');
    console.log('   Fix major failures before proceeding');
  } else {
    console.log('❌ POOR! Multiple critical failures');
    console.log('   Review and fix all issues before continuing');
  }
  
  // List failures
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.log('\n⚠️  FAILURES NEEDING ATTENTION:');
    failures.forEach(failure => {
      console.log(`   ❌ ${failure.name}: ${failure.error || `HTTP ${failure.statusCode}`}`);
    });
  }
  
  console.log('\n🔗 QUICK ACCESS LINKS:');
  console.log('   Store: http://localhost:5173');
  console.log('   Admin: http://localhost:5173/admin/login');
  console.log('   API Health: http://localhost:5000/api/health');
  console.log('   Sitemap: http://localhost:5000/sitemap/sitemap.xml');
  
  console.log('\n📋 NEXT STEPS:');
  if (passed === tests.length) {
    console.log('   1. ✅ Phase 8.4: Analytics Integration');
    console.log('   2. ✅ Final Testing & Deployment');
    console.log('   3. ✅ Launch!');
  } else {
    console.log('   1. 🔧 Fix the issues listed above');
    console.log('   2. 🧪 Re-run this test');
    console.log('   3. ✅ Proceed to Phase 8.4 when ready');
  }
}

runTests();
