import re

files = [
    r'E:\Kerala-Jewellers-final\products.html',
    r'E:\Kerala-Jewellers-final\silver-products.html',
    r'E:\Kerala-Jewellers-final\diamonds-products.html'
]

new_header = '''<div id="site-header"></div>
<script src="js/header-loader.js"></script>'''

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()

    # Safely replace ONLY the site-header
    new_html, count = re.subn(r'<header[^>]*class="[^"]*site-header[^"]*"[^>]*>.*?</header>', new_header, html, flags=re.DOTALL | re.IGNORECASE)
    
    if count > 0:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Updated {file}")
    else:
        print(f"Failed to find site-header in {file}")
