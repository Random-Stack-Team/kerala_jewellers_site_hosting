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
        continue
        
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Remove the premium-header-repairs script completely
    new_content = re.sub(
        r'<script id="premium-header-repairs">.*?</script>',
        '',
        content,
        flags=re.DOTALL
    )
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Removed script from {fname}')
