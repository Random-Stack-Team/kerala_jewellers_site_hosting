const fs = require('fs');
const cssPath = 'css/style.css';
const css = fs.readFileSync(cssPath, 'utf8');

const lines = css.split(/(?<=\r?\n)/);
let newLines = [];
let skipUntilBraceClose = false;
let removedCount = 0;

const targetPrefixes = [
  '.w-nav',
  '.w-dropdown'
];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  
  if (skipUntilBraceClose) {
    if (trimmed.includes('}')) {
      skipUntilBraceClose = false;
    }
    continue;
  }
  
  // Look for start of a targeted block
  let matchesTarget = targetPrefixes.some(prefix => trimmed.startsWith(prefix));
  
  if (matchesTarget) {
    let selectorText = line;
    let j = i;
    while (!selectorText.includes('{') && j < lines.length - 1) {
      j++;
      selectorText += lines[j];
    }
    
    // Check if it's mixed
    let isMixed = false;
    let sels = selectorText.split('{')[0].split(',');
    for (let s of sels) {
       let cleanS = s.replace(/\/\*[\s\S]*?\*\//g, '').trim();
       if (!cleanS) continue;
       
       let matchesPrefix = targetPrefixes.some(prefix => cleanS.includes(prefix));
       if (!matchesPrefix) {
         isMixed = true;
         break;
       }
    }
    
    if (!isMixed) {
      removedCount++;
      skipUntilBraceClose = !selectorText.includes('}');
      i = j; // skip all selector lines
      continue;
    }
  }
  
  newLines.push(line);
}

fs.writeFileSync(cssPath, newLines.join(''), 'utf8');
console.log('Removed blocks:', removedCount);
