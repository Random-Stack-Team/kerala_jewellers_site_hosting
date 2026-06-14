const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      if (fs.statSync(file).isDirectory()) {
        if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('tests')) {
          results = results.concat(walk(file));
        }
      } else if (file.endsWith('.html')) {
        results.push(file);
      }
    });
  } catch(e) {}
  return results;
}

const files = walk('e:/Kerala-Jewellers-final');
let count = 0;
let extractedCSS = '';

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  
  // Extract CSS
  const match = content.match(/<style id="kj-product-detail-critical">([\s\S]*?)<\/style>/);
  if (match) {
    if (!extractedCSS) {
      extractedCSS = match[1].trim();
    }
    content = content.replace(/<style id="kj-product-detail-critical">[\s\S]*?<\/style>/, '');
  }
  
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    count++;
    console.log('Removed from:', f);
  }
});

if (extractedCSS && count > 0) {
  const cssPath = 'e:/Kerala-Jewellers-final/css/style.css';
  let cssContent = fs.readFileSync(cssPath, 'utf8');
  if (!cssContent.includes('.section-product-info .product-header5_layout')) {
    fs.appendFileSync(cssPath, '\n/* Extracted from product HTMLs */\n' + extractedCSS + '\n');
    console.log('Appended extracted CSS to style.css');
  }
}

console.log('Total files cleaned:', count);
