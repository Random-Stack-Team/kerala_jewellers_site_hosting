import re
import os

base_dir = r'E:\Kerala-Jewellers-final'

# 1. Update navbar.css
navbar_css_path = os.path.join(base_dir, 'css', 'navbar.css')
with open(navbar_css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Fix "About Us" wrapping by adding white-space: nowrap
css = re.sub(
    r'(\.site-nav__panel \.bko-wrap-111-2 > a,[^\{]*\{)',
    r'\1\n  white-space: nowrap !important;',
    css
)

# Add gap to site-header__container to prevent logo and rate strip from touching
css = re.sub(
    r'(\.desktop-header \.site-header__container\s*\{[^}]*justify-content:\s*space-between\s*!important;)',
    r'\1\n  gap: 30px !important;',
    css
)

# Ensure logo doesn't shrink
if '.site-header__brand-area' not in css:
    css += '''
.site-header__brand-area {
  flex-shrink: 0 !important;
}
'''

with open(navbar_css_path, 'w', encoding='utf-8') as f:
    f.write(css)


# 2. Update cache buster in all HTML files to force the new CSS on all pages
html_files = []
for root, dirs, files in os.walk(base_dir):
    if 'node_modules' in root or '.git' in root or 'assets' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Update cache string from something like v=kj-hard-refresh-20 to v=kj-hard-refresh-22
    new_html = re.sub(r'v=kj-hard-refresh-\d+', 'v=kj-hard-refresh-22', html)
    
    if new_html != html:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_html)

print('Applied fixes for nowrap, logo gap, and updated cache buster in HTML files.')
