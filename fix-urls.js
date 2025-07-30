const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'https://cosmicproject-backend-1.onrender.com';

function replaceUrlsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Replace hardcoded localhost URLs
    content = content.replace(/http:\/\/localhost:5000/g, API_BASE_URL);
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      replaceUrlsInFile(filePath);
    }
  });
}

console.log('🔧 Replacing hardcoded localhost URLs with production API URL...');
processDirectory('./src');
console.log('✅ URL replacement complete!'); 