import os
import re

base_dir = r'E:\Kerala-Jewellers-final'

html_files = []
for root, dirs, files in os.walk(base_dir):
    if 'node_modules' in root or '.git' in root or 'assets' in root or 'scratch' in root or 'graphify-out' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to remove the <style> block that contains "Force dark red header background"
    # and the <style> block that contains "header.site-header .kj-megamenu-panel"
    
    original_content = content
    
    # Remove block 1
    content = re.sub(r'<style[^>]*>\s*/\*\s*1\.\s*Force dark red header background.*?</style>', '', content, flags=re.DOTALL)
    
    # Remove block 2
    content = re.sub(r'<style[^>]*>\s*header\.site-header\s*\{.*?</style>', '', content, flags=re.DOTALL)
    
    if content != original_content:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned embedded styles in {os.path.relpath(html_file, base_dir)}")
