const http = require('http');

console.log('🎯 PHASE 8.4 READINESS TEST');
console.log('===========================');

const tests = [
    { name: 'Backend API', url: 'http://localhost:5000/api/health' },
    { name: 'Frontend App', url: 'http://localhost:5173' }
];

let passed = 0;

function testService(test) {
    return new Promise((resolve) => {
        const req = http.get(test.url, (res) => {
            console.log(`✅ ${test.name} - HTTP ${res.statusCode}`);
            passed++;
            resolve(true);
        });
        
        req.on('error', (err) => {
            console.log(`❌ ${test.name} - ${err.code}`);
            resolve(false);
        });
        
        req.setTimeout(3000, () => {
            console.log(`❌ ${test.name} - Timeout`);
            req.destroy();
            resolve(false);
        });
    });
}

async function runTests() {
    console.log('\n🧪 Testing services...\n');
    
    for (const test of tests) {
        await testService(test);
    }
    
    console.log('\n📊 RESULTS');
    console.log('=========');
    console.log(`Passed: ${passed}/${tests.length}`);
    
    console.log('\n🎯 PHASE 8.4 STATUS');
    console.log('=================');
    
    if (passed === tests.length) {
        console.log('🚀 READY FOR ANALYTICS INTEGRATION!');
        console.log('\nYou can now proceed with:');
        console.log('1. Google Analytics setup');
        console.log('2. Performance monitoring');
        console.log('3. User behavior tracking');
        console.log('4. Conversion analytics');
    } else if (passed >= 1) {
        console.log('⚠️  PARTIALLY READY');
        console.log('Fix issues before full analytics implementation');
    } else {
        console.log('❌ NOT READY');
        console.log('Start services with: ./start-all.sh');
    }
    
    console.log('\n🔗 Access your application:');
    console.log('   Store: http://localhost:5173');
    console.log('   API:   http://localhost:5000/api/health');
}

runTests();
