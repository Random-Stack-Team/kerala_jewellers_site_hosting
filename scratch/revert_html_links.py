import re

# Fix header.html
with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('href="products?category=', 'href="products.html?category=')
html = html.replace('href="silver-products?category=', 'href="silver-products.html?category=')
html = html.replace('href="diamonds-products?category=', 'href="diamonds-products.html?category=')

# Also fix the mobile links if they lost their .html
html = html.replace('href="products"', 'href="products.html"')
html = html.replace('href="silver-products"', 'href="silver-products.html"')
html = html.replace('href="diamonds-products"', 'href="diamonds-products.html"')
html = html.replace('href="coming-soon"', 'href="coming-soon.html"')
html = html.replace('href="about"', 'href="about.html"')
html = html.replace('href="thanga-mazhai"', 'href="thanga-mazhai.html"')

with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'w', encoding='utf-8') as f:
    f.write(html)


# Fix app.js basePages
with open(r'E:\Kerala-Jewellers-final\js\app.js', 'r', encoding='utf-8') as f:
    app = f.read()

old_basePages = '''    const basePages = {
      gold: prefix + 'products',
      silver: prefix + 'silver-products',
      diamond: prefix + 'diamonds-products',
      platinum: prefix + 'coming-soon',
      scheme: prefix + 'thanga-mazhai'
    };'''

new_basePages = '''    const basePages = {
      gold: prefix + 'products.html',
      silver: prefix + 'silver-products.html',
      diamond: prefix + 'diamonds-products.html',
      platinum: prefix + 'coming-soon.html',
      scheme: prefix + 'thanga-mazhai.html'
    };'''

app = app.replace(old_basePages, new_basePages)

with open(r'E:\Kerala-Jewellers-final\js\app.js', 'w', encoding='utf-8') as f:
    f.write(app)

print("Updated links and app.js")
