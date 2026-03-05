#!/usr/bin/env node

/**
 * Security Check Script
 * Validates that all security measures are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 Running Security Check...\n');

let hasErrors = false;

// Check 1: .env file exists
console.log('1. Checking .env file...');
if (!fs.existsSync('.env')) {
  console.error('   ❌ .env file not found! Copy .env.example to .env');
  hasErrors = true;
} else {
  console.log('   ✅ .env file exists');
  
  // Check if .env has placeholder values
  const envContent = fs.readFileSync('.env', 'utf8');
  if (envContent.includes('your_') || envContent.includes('AIzaSyBF_DthO5AGtmkDdkrN16xmh1Aezx96b6I')) {
    console.error('   ⚠️  WARNING: .env contains placeholder or exposed keys! Replace with your own keys.');
    hasErrors = true;
  }
}

// Check 2: .env in .gitignore
console.log('\n2. Checking .gitignore...');
const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
if (!gitignoreContent.includes('.env')) {
  console.error('   ❌ .env not in .gitignore! Add it immediately.');
  hasErrors = true;
} else {
  console.log('   ✅ .env is in .gitignore');
}

// Check 3: No hardcoded keys in source files
console.log('\n3. Checking for hardcoded API keys...');
const filesToCheck = [
  'src/firebase.js',
  'src/App.js'
];

let foundHardcodedKeys = false;
filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    // Check for common API key patterns
    if (content.match(/['"]AIza[a-zA-Z0-9_-]{35}['"]/) || 
        content.match(/['"]hf_[a-zA-Z0-9]{34}['"]/)) {
      console.error(`   ❌ Found hardcoded API key in ${file}`);
      foundHardcodedKeys = true;
      hasErrors = true;
    }
  }
});

if (!foundHardcodedKeys) {
  console.log('   ✅ No hardcoded API keys found');
}

// Check 4: Security.js exists
console.log('\n4. Checking security utilities...');
if (!fs.existsSync('src/security.js')) {
  console.error('   ❌ src/security.js not found!');
  hasErrors = true;
} else {
  console.log('   ✅ Security utilities exist');
}

// Check 5: Firestore rules
console.log('\n5. Checking Firestore rules...');
if (!fs.existsSync('firestore.rules')) {
  console.error('   ❌ firestore.rules not found!');
  hasErrors = true;
} else {
  const rulesContent = fs.readFileSync('firestore.rules', 'utf8');
  if (!rulesContent.includes('isOwner') || !rulesContent.includes('isAuthenticated')) {
    console.error('   ⚠️  WARNING: Firestore rules may not have proper security functions');
  } else {
    console.log('   ✅ Firestore rules have security functions');
  }
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('❌ SECURITY CHECK FAILED!');
  console.error('Please fix the issues above before deploying.');
  process.exit(1);
} else {
  console.log('✅ SECURITY CHECK PASSED!');
  console.log('All security measures are in place.');
  console.log('\n⚠️  REMINDER: Make sure to rotate all API keys if they were exposed!');
}
