// Push to GitHub Script
const { execSync } = require('child_process');
const path = require('path');

const projectPath = 'C:\\Users\\nitin\\OneDrive\\E comerse website\\nexcart';
const gitPath = 'C:\\Program Files\\Git\\cmd';

// Set PATH to include Git
process.env.PATH = `${gitPath};${process.env.PATH}`;

console.log('========================================');
console.log('PUSHING NEXCART TO GITHUB');
console.log('========================================\n');

try {
  // Change to project directory
  process.chdir(projectPath);
  
  console.log('Step 1: Adding remote origin...');
  try {
    execSync('git remote add origin https://github.com/nitinkmclu9/nexcart.git', { stdio: 'inherit' });
    console.log('[OK] Remote added\n');
  } catch (e) {
    console.log('[INFO] Remote already exists or error occurred\n');
  }
  
  console.log('Step 2: Renaming branch to main...');
  execSync('git branch -M main', { stdio: 'inherit' });
  console.log('[OK] Branch renamed to main\n');
  
  console.log('========================================');
  console.log('READY TO PUSH!');
  console.log('========================================');
  console.log('\nNow you need to push manually:');
  console.log('\n1. Open Git Bash or Command Prompt');
  console.log('2. Run: cd "C:\\Users\\nitin\\OneDrive\\E comerse website\\nexcart"');
  console.log('3. Run: git push -u origin main');
  console.log('4. When prompted:');
  console.log('   - Username: nitinkmclu9');
  console.log('   - Password: Your GitHub TOKEN\n');
  console.log('========================================\n');
  
} catch (error) {
  console.error('Error:', error.message);
}
