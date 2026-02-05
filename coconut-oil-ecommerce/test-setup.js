const { exec } = require('child_process');
const fs = require('fs');

console.log('Testing project setup...\n');

// Check if directories exist
const dirs = ['backend', 'frontend', 'backend/src', 'frontend/src'];
dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✓ ${dir} exists`);
  } else {
    console.log(`✗ ${dir} missing`);
  }
});

// Check package.json files
const packages = ['package.json', 'backend/package.json', 'frontend/package.json'];
packages.forEach(pkg => {
  if (fs.existsSync(pkg)) {
    try {
      const content = JSON.parse(fs.readFileSync(pkg, 'utf8'));
      console.log(`✓ ${pkg} valid`);
    } catch (e) {
      console.log(`✗ ${pkg} invalid JSON: ${e.message}`);
    }
  } else {
    console.log(`✗ ${pkg} missing`);
  }
});

// Check node_modules
const nodeModules = ['backend/node_modules', 'frontend/node_modules'];
nodeModules.forEach(nm => {
  if (fs.existsSync(nm)) {
    console.log(`✓ ${nm} exists`);
  } else {
    console.log(`✗ ${nm} missing - run npm install`);
  }
});

console.log('\nSetup test complete!');
