import glob
import re

files = glob.glob(r'E:\Kerala-Jewellers-final\*.html')

new_header = '''<div id="site-header"></div>
<script src="js/header-loader.js"></script>'''

updated = 0
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
        
    if 'id="site-header"' in html or 'partials/header.html' in file:
        continue
        
    new_html, count = re.subn(r'<header[^>]*class="[^"]*site-header[^"]*"[^>]*>.*?</header>', new_header, html, flags=re.DOTALL | re.IGNORECASE)
    
    if count == 0:
        if html.lower().count('<header') == 1:
            new_html, count = re.subn(r'<header[^>]*>.*?</header>', new_header, html, flags=re.DOTALL | re.IGNORECASE)
            
    if count > 0:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_html)
        updated += 1
        print(f"Updated {file}")

print(f"Total root files updated: {updated}")
