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

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  
  content = content.replace(/<script id="premium-header-repairs">[\s\S]*?<\/script>/g, '');
  
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    count++;
    console.log('Removed from:', f);
  }
});

console.log('Total files cleaned:', count);
