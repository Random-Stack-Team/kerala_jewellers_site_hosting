import re

with open(r'E:\Kerala-Jewellers-final\js\app.js', 'r', encoding='utf-8') as f:
    app = f.read()

# Replace basePages
old_basePages = '''    const basePages = {
      gold: prefix + 'products.html',
      silver: prefix + 'silver-products.html',
      diamond: prefix + 'diamonds-products.html',
      platinum: prefix + 'coming-soon.html',
      scheme: prefix + 'thanga-mazhai.html'
    };'''

new_basePages = '''    const basePages = {
      gold: prefix + 'products',
      silver: prefix + 'silver-products',
      diamond: prefix + 'diamonds-products',
      platinum: prefix + 'coming-soon',
      scheme: prefix + 'thanga-mazhai'
    };'''

app = app.replace(old_basePages, new_basePages)

# Replace same_page_filter_logic
# Need to use exact string to avoid regex escapes
old_logic = "if (category && url.pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '')) {"
new_logic = """const normalizePath = (p) => p.replace(/\\/$/, '').replace(/\\.html$/, '');
        if (category && normalizePath(url.pathname) === normalizePath(window.location.pathname)) {"""

app = app.replace(old_logic, new_logic)

with open(r'E:\Kerala-Jewellers-final\js\app.js', 'w', encoding='utf-8') as f:
    f.write(app)

print('Updated app.js')
