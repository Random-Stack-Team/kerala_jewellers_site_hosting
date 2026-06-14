const fs = require('fs');
const path = require('path');

let filesToScan = [
    'e:/Kerala-Jewellers-final/products.html',
    'e:/Kerala-Jewellers-final/silver-products.html',
    'e:/Kerala-Jewellers-final/diamonds-products.html',
    'e:/Kerala-Jewellers-final/coming-soon.html',
    'e:/Kerala-Jewellers-final/index.html' // index might have product carousels
];

// Add subdirectories
const dirs = ['goldproducts', 'silverproducts', 'diamondproducts'];
dirs.forEach(d => {
    let dp = 'e:/Kerala-Jewellers-final/' + d;
    if (fs.existsSync(dp)) {
        fs.readdirSync(dp).forEach(f => {
            if (f.endsWith('.html')) {
                filesToScan.push(path.join(dp, f));
            }
        });
    }
});

let allClasses = new Set();
let htmlContents = [];

filesToScan.forEach(p => {
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        htmlContents.push(content);
        
        let regex = /class="([^"]+)"/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            let cl = match[1];
            let parts = cl.split(/\s+/);
            parts.forEach(c => {
                if (c) allClasses.add(c);
            });
        }
    }
});

let css = fs.readFileSync('e:/Kerala-Jewellers-final/css/style.css', 'utf8');
let regexCss = /([^{]+)\{/g;
let matchCss;
let productCssClasses = new Set();

while ((matchCss = regexCss.exec(css)) !== null) {
    let selector = matchCss[1].trim();
    if (selector.includes('product') || selector.includes('item') || selector.includes('grid')) {
        let classMatches = selector.match(/\.([\w-]+)/g);
        if (classMatches) {
            classMatches.forEach(p => {
                productCssClasses.add(p.substring(1));
            });
        }
    }
}

let usedProductClasses = [];
let unusedProductClasses = [];

productCssClasses.forEach(c => {
    if (allClasses.has(c)) {
        usedProductClasses.push(c);
    } else {
        let used = htmlContents.some(html => html.includes(c));
        if (!used) {
            unusedProductClasses.push(c);
        } else {
            usedProductClasses.push(c);
        }
    }
});

fs.writeFileSync('e:/Kerala-Jewellers-final/unused_product.txt', unusedProductClasses.join(', '));
fs.writeFileSync('e:/Kerala-Jewellers-final/used_product.txt', usedProductClasses.join(', '));

console.log('Total files scanned: ' + filesToScan.length);
console.log('Used Product Classes: ' + usedProductClasses.length);
console.log('Unused Product Classes: ' + unusedProductClasses.length);

let unusedSafeToRemove = unusedProductClasses.filter(c => c.match(/(product-item-\d+|image-\d+|product-img-\d+|price-\d+|product-name-\d+|heading-\d+|div-block-\d+|list-item-\d+)/));
console.log('Recommended Safe Removals (Highly specific generated): ' + unusedSafeToRemove.length);
