import os
import glob
import re

root_dir = 'E:\\Kerala-Jewellers-final'
html_files = []

for root, dirs, files in os.walk(root_dir):
    if 'node_modules' in root or '.git' in root or 'test-results' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

# Classes to safely strip (must have space boundaries)
classes_to_remove = ['w-nav', 'w-dropdown', 'w-container', 'w-inline-block']
class_pattern = re.compile(r'\b(?:' + '|'.join(classes_to_remove) + r')\b\s*')

# Attributes to strip
attr_pattern = re.compile(r'\s*data-w(?:f-page|f-site|-id)="[^"]*"')

for file in html_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        with open(file, 'r', encoding='latin-1') as f:
            content = f.read()
            
    # Remove dead Webflow classes
    content = class_pattern.sub('', content)
    
    # Cleanup empty class attributes if any (e.g. class="")
    content = re.sub(r'class="\s*"', '', content)
    
    # Remove Webflow data attributes
    content = attr_pattern.sub('', content)
    
    try:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
    except Exception:
        with open(file, 'w', encoding='latin-1') as f:
            f.write(content)

print(f"Cleaned {len(html_files)} HTML files of dead Webflow remnants.")
