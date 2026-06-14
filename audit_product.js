const fs = require('fs');
const files = ['gold.html', 'silver.html', 'diamond.html', 'platinum.html'];
let allClasses = new Set();
let htmlContents = [];

files.forEach(f => {
    let p = 'e:/Kerala-Jewellers-final/' + f;
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
