const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectPath = 'C:\\Users\\nitin\\OneDrive\\E comerse website\\nexcart';
const gitPath = 'C:\\Program Files\\Git\\cmd';

// Set PATH
process.env.PATH = `${gitPath};${process.env.PATH}`;

// Change to project directory
process.chdir(projectPath);

console.log('========================================');
console.log('PUSHING LATEST CODE TO GITHUB');
console.log('========================================\n');

try {
  // Check current commit
  const currentCommit = execSync('git log --oneline -1', { encoding: 'utf8' }).trim();
  console.log('Current commit:', currentCommit, '\n');
  
  // Try to push
  console.log('Pushing to GitHub...');
  console.log('If prompted, use:');
  console.log('  Username: nitinkmclu9');
  console.log('  Password: Your GitHub token\n');
  
  const result = execSync('git push -u origin main', {
    stdio: 'inherit',
    encoding: 'utf8'
  });
  
  console.log('\n========================================');
  console.log('SUCCESS! Pushed to GitHub');
  console.log('========================================\n');
  
  console.log('Now go to Render and:');
  console.log('1. Go to: https://render.com/dashboard');
  console.log('2. Click on your backend service');
  console.log('3. Click "Manual Deploy" → "Deploy latest commit"');
  console.log('4. Or wait for auto-deploy (should trigger automatically)\n');
  
} catch (error) {
  console.error('\nPush failed with error:', error.message);
  console.log('\n========================================');
  console.log('MANUAL PUSH REQUIRED');
  console.log('========================================\n');
  console.log('Open Git Bash or Command Prompt and run:\n');
  console.log('  cd "C:\\Users\\nitin\\OneDrive\\E comerse website\\nexcart"');
  console.log('  git push -u origin main\n');
  console.log('When prompted:');
  console.log('  Username: nitinkmclu9');
  console.log('  Password: (paste your GitHub token)\n');
  console.log('========================================\n');
}
