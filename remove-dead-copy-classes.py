"""
Remove dead copy-classes from style.css.
These are CSS classes containing '-copy' that are not used in any HTML file.
"""
import re
import os
import glob

PROJECT_ROOT = r'E:\Kerala-Jewellers-final'
CSS_FILE = os.path.join(PROJECT_ROOT, 'css', 'style.css')

# Find all HTML files
html_files = []
for pattern in ['*.html', '**/*.html', 'partials/*.html', 'goldproducts/*.html', 'silverproducts/*.html', 'diamondproducts/*.html']:
    html_files.extend(glob.glob(os.path.join(PROJECT_ROOT, pattern), recursive=True))
html_files = list(set(html_files))

# Read all HTML content to check class usage
html_content = set()
for f in html_files:
    try:
        with open(f, 'r', encoding='utf-8') as fh:
            html_content.add(fh.read())
    except:
        pass

all_html = '\n'.join(html_content)

# Read CSS file
with open(CSS_FILE, 'r', encoding='utf-8') as f:
    css_lines = f.readlines()

# Find all copy-class selectors and their line indices
copy_class_pattern = re.compile(r'\.([\w-]*copy[\w-]*)')
dead_blocks = []

i = 0
while i < len(css_lines):
    line = css_lines[i]
    # Check if this line starts a CSS rule with a copy-class selector
    match = re.match(r'^(\.[\w-]*copy[\w-]*)', line.strip())
    if match:
        class_name = match.group(1)
        # Check if this class is used in any HTML file
        if class_name not in all_html:
            # Find the end of this CSS block (matching closing brace)
            start_line = i
            brace_count = 0
            found_open = False
            end_line = i
            
            for j in range(i, len(css_lines)):
                for ch in css_lines[j]:
                    if ch == '{':
                        brace_count += 1
                        found_open = True
                    elif ch == '}':
                        brace_count -= 1
                
                if found_open and brace_count == 0:
                    end_line = j
                    break
            
            dead_blocks.append((start_line, end_line, class_name))
            i = end_line + 1
        else:
            i += 1
    else:
        i += 1

print(f"Found {len(dead_blocks)} dead copy-class blocks to remove")

# Remove dead blocks (in reverse order to preserve line numbers)
for start, end, class_name in reversed(dead_blocks):
    print(f"  Removing .{class_name} (lines {start+1}-{end+1})")
    del css_lines[start:end+1]

# Write cleaned CSS
with open(CSS_FILE, 'w', encoding='utf-8') as f:
    f.writelines(css_lines)

print(f"\nDone! Removed {len(dead_blocks)} dead copy-class blocks from style.css")
print(f"File reduced from {len(css_lines) + sum(e-s+1 for s,e,_ in dead_blocks)} to {len(css_lines)} lines")
