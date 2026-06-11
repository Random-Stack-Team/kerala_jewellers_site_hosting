import os
import glob
import re

folders = ['goldproducts', 'silverproducts', 'diamondproducts', 'post']
base_dir = r'E:\Kerala-Jewellers-final'

new_header = '''<div id="site-header"></div>
<script src="../js/header-loader.js"></script>'''

total_files = 0
updated_files = 0

for folder in folders:
    folder_path = os.path.join(base_dir, folder)
    files = glob.glob(os.path.join(folder_path, '*.html'))
    for file in files:
        total_files += 1
        with open(file, 'r', encoding='utf-8') as f:
            html = f.read()
        
        # Check if already updated
        if '<div id="site-header"></div>' in html:
            continue
            
        # Replace <header class="site-header header"...>...</header>
        # Use regex to find the header block
        # Webflow headers usually have a specific id or class
        # Let's match <header ...> to </header>
        
        # The regex should be non-greedy
        new_html, count = re.subn(r'<header[^>]*class="[^"]*site-header[^"]*"[^>]*>.*?</header>', new_header, html, flags=re.DOTALL | re.IGNORECASE)
        
        if count == 0:
            # Maybe it doesn't have class="site-header", just try <header> if there is only one
            if html.lower().count('<header') == 1:
                new_html, count = re.subn(r'<header[^>]*>.*?</header>', new_header, html, flags=re.DOTALL | re.IGNORECASE)
                
        # Also remove any old inline scripts that might have been added to fix the navbar
        # Since the user requested it, let's look for any inline script that mentions "navbar" or "header"
        # and remove it to be safe, if it's an inline script (no src)
        new_html = re.sub(r'<script(?![^>]*src=)[^>]*>.*?(?:navbar|site-header|kj-megamenu).*?</script>', '', new_html, flags=re.DOTALL | re.IGNORECASE)

        if count > 0:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_html)
            updated_files += 1

print(f"Total files checked: {total_files}")
print(f"Total files updated: {updated_files}")
