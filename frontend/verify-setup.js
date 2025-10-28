#!/usr/bin/env node

/**
 * Verification script for Calculator App
 * Checks if the project structure is correct and dependencies can be resolved
 */

const fs = require('fs');
const path = require('path');

console.log('🧮 Calculator App - Setup Verification\n');

// Check if essential files exist
const requiredFiles = [
  'package.json',
  'src/App.tsx',
  'src/main.tsx',
  'src/components/Calculator/Calculator.tsx',
  'src/pages/CalculatorPage.tsx',
  'vitest.config.ts',
  'README.md'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} (missing)`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n✅ All required files are present!');
  console.log('\n📋 Next Steps:');
  console.log('1. Install dependencies: npm install');
  console.log('2. Start development: npm run dev');
  console.log('3. Run tests: npm run test:ci');
  console.log('4. Build for production: npm run build');
} else {
  console.log('\n❌ Some files are missing. Please check the setup.');
}

// Check package.json structure
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('\n📦 Package.json validation:');
  
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log('✅ Build script exists');
  } else {
    console.log('❌ Build script missing');
  }
  
  if (packageJson.dependencies && packageJson.dependencies.react) {
    console.log('✅ React dependency found');
  } else {
    console.log('❌ React dependency missing');
  }
  
  if (packageJson.devDependencies && packageJson.devDependencies.vitest) {
    console.log('✅ Testing framework configured');
  } else {
    console.log('❌ Testing framework missing');
  }
  
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

console.log('\n🔧 For npm instead of pnpm:');
console.log('   Replace any pnpm commands with npm equivalents');
console.log('   Example: npm install, npm run build, npm run test:ci');

console.log('\n📚 Documentation: Check README.md and setup.md for detailed instructions');