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

# Regex to find a tag with platinumlink or platinumlink-2 and replace its href
# e.g., <a class="platinumlink inline-block" href="platinum-products.html"> -> href="coming-soon.html"
# Or <a href="platinum-products.html" class="platinumlink">

def replace_href(match):
    full_tag = match.group(0)
    # Replace the href attribute inside this tag
    new_tag = re.sub(r'href="[^"]+"', 'href="coming-soon.html"', full_tag)
    return new_tag

tag_pattern = re.compile(r'<a\b[^>]*class="[^"]*\bplatinumlink(?:-2)?\b[^"]*"[^>]*>')

updated_count = 0
for file in html_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        with open(file, 'r', encoding='latin-1') as f:
            content = f.read()
            
    new_content = tag_pattern.sub(replace_href, content)
    
    # Also explicitly find and replace any other loose links to platinum-products.html inside mobile nav, etc.
    # The user specifically wants clicking platinum to redirect to comingsoon.html
    new_content = re.sub(r'href="[^"]*platinum-products\.html"', 'href="coming-soon.html"', new_content)
    
    if new_content != content:
        try:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
        except Exception:
            with open(file, 'w', encoding='latin-1') as f:
                f.write(new_content)
        updated_count += 1

print(f"Updated {updated_count} HTML files to redirect Platinum to coming-soon.html")
