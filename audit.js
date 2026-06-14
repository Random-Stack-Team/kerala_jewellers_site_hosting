const fs = require('fs');
const css = require('css');

const files = {
  'style.css': fs.readFileSync('e:/Kerala-Jewellers-final/css/style.css', 'utf8'),
  'navbar.css': fs.readFileSync('e:/Kerala-Jewellers-final/css/navbar.css', 'utf8'),
  'responsive.css': fs.readFileSync('e:/Kerala-Jewellers-final/css/responsive.css', 'utf8')
};

const ASTs = {};
for (const [name, content] of Object.entries(files)) {
  ASTs[name] = css.parse(content, { source: name });
}

const navbarKeywords = ['kj-megamenu', 'dropdown', 'bko-dropdown', 'site-header', 'mobile-header', 'navbar', 'nav', 'bko-wrap-111-2', 'bko-container', 'goldlink', 'silverlink', 'diamondlink', 'rate-dropdown'];

let report = [];

// Helper to extract all rules (handling media queries)
function extractRules(ast, fileName) {
  let rules = [];
  ast.stylesheet.rules.forEach(node => {
    if (node.type === 'rule') {
      rules.push({ node, fileName, inMedia: false, mediaStr: '' });
    } else if (node.type === 'media') {
      node.rules.forEach(r => {
        if (r.type === 'rule') {
          rules.push({ node: r, fileName, inMedia: true, mediaStr: node.media });
        }
      });
    }
  });
  return rules;
}

const allRules = [];
for (const name of Object.keys(ASTs)) {
  allRules.push(...extractRules(ASTs[name], name));
}

// 1. Navbar/mega menu rules currently in style.css
// 2. Mobile/tablet rules currently in style.css or navbar.css
// 3. Global/page rules currently inside navbar.css
// 4. Duplicate selectors across the three CSS files
// 5. Risky selectors that should not be moved yet

let selectorMap = {};

allRules.forEach(ruleInfo => {
  const { node, fileName, inMedia, mediaStr } = ruleInfo;
  node.selectors.forEach(selector => {
    if (!selectorMap[selector]) selectorMap[selector] = [];
    selectorMap[selector].push({ fileName, inMedia, mediaStr });
    
    let isNavbarSelector = navbarKeywords.some(k => selector.includes(k));
    
    // Check 1: Navbar rules in style.css
    if (fileName === 'style.css' && isNavbarSelector && !inMedia) {
      report.push({
        selector, current: fileName, recommended: 'navbar.css', safe: 'risky',
        reason: 'Navbar specific selector found in global style.css (risky if it overrides global UI)'
      });
    }
    
    // Check 2: Mobile rules in style.css or navbar.css
    if ((fileName === 'style.css' || fileName === 'navbar.css') && inMedia && mediaStr.includes('max-width')) {
      report.push({
        selector, current: fileName + ` (${mediaStr})`, recommended: 'responsive.css', safe: 'safe',
        reason: 'Mobile/tablet media query found outside responsive.css'
      });
    }
    
    // Check 3: Global rules inside navbar.css
    if (fileName === 'navbar.css' && !isNavbarSelector) {
      // Is it a generic tag or global class?
      if (!selector.includes('.') && !selector.includes('#')) {
        report.push({
          selector, current: fileName, recommended: 'style.css', safe: 'risky',
          reason: 'Global tag selector found inside navbar.css'
        });
      } else {
        report.push({
          selector, current: fileName, recommended: 'style.css', safe: 'unknown',
          reason: 'Non-navbar selector found inside navbar.css'
        });
      }
    }
  });
});

// Check 4: Duplicates
for (const [selector, locations] of Object.entries(selectorMap)) {
  const filesSet = new Set(locations.map(l => l.fileName));
  if (filesSet.size > 1) {
    report.push({
      selector, current: Array.from(filesSet).join(', '), recommended: 'Consolidate based on context', safe: 'risky',
      reason: 'Selector duplicated across multiple CSS files'
    });
  }
}

// Generate Markdown
let md = `# Phase 6: CSS Ownership Audit Report\n\n`;
md += `| Selector | Current File | Recommended Owner | Status | Reason |\n`;
md += `|---|---|---|---|---|\n`;

report.slice(0, 300).forEach(r => {
  md += `| \`${r.selector}\` | ${r.current} | ${r.recommended} | **${r.safe.toUpperCase()}** | ${r.reason} |\n`;
});

if (report.length > 300) {
  md += `\n*Note: Report truncated, found ${report.length} total issues.*`;
}

fs.writeFileSync('e:/Kerala-Jewellers-final/css_ownership_audit_report.md', md, 'utf8');
console.log('Report written with ' + report.length + ' entries.');
