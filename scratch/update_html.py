import re
import os

files_to_update = [
    'index.html',
    'products.html',
    'silver-products.html',
    'diamonds-products.html',
    'about.html',
    'contact.html'
]

base_dir = r'E:\Kerala-Jewellers-final'

for fname in files_to_update:
    path = os.path.join(base_dir, fname)
    if not os.path.exists(path):
        print(f'File not found: {fname}')
        continue
        
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace the header
    new_content = re.sub(
        r'<header class="site-header.*?</header>',
        '<div id="site-header"></div>\n<script src="js/header-loader.js"></script>',
        content,
        flags=re.DOTALL
    )
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {fname}')
    else:
        print(f'No change in {fname}')
