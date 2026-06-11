import os
import re

style_file = r'E:\Kerala-Jewellers-final\css\style.css'
resp_file = r'E:\Kerala-Jewellers-final\css\responsive.css'

def get_blocks(css):
    # Strip comments
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
    blocks = []
    
    idx = 0
    while idx < len(css):
        start_brace = css.find('{', idx)
        if start_brace == -1:
            break
            
        selector = css[idx:start_brace].strip()
        
        brace_count = 1
        end_brace = start_brace + 1
        while end_brace < len(css) and brace_count > 0:
            if css[end_brace] == '{':
                brace_count += 1
            elif css[end_brace] == '}':
                brace_count -= 1
            end_brace += 1
            
        block_body = css[start_brace+1:end_brace-1]
        
        # Don't try to deduplicate nested media queries safely with this simple logic,
        # just handle top-level rules. If a selector contains @media, skip it.
        if not selector.startswith('@media') and not selector.startswith('@keyframes'):
            # normalize body: remove spaces, semicolons, newlines
            norm_body = re.sub(r'\s+', '', block_body).strip(';')
            
            # handle multiple selectors: split by comma but preserve the original full selector string
            blocks.append({
                'selector': selector,
                'norm_body': norm_body,
                'start_idx': idx,
                'end_idx': end_brace,
                'original': css[idx:end_brace]
            })
            
        idx = end_brace
        
    return blocks

with open(style_file, 'r', encoding='utf-8') as f:
    style_css = f.read()
    
with open(resp_file, 'r', encoding='utf-8') as f:
    resp_css = f.read()

style_blocks = get_blocks(style_css)
resp_blocks = get_blocks(resp_css)

# Create a set of (selector, norm_body) for style.css
style_set = set()
for b in style_blocks:
    # A selector string could have spaces differences, let's normalize selector spaces
    norm_sel = re.sub(r'\s+', ' ', b['selector']).strip()
    style_set.add((norm_sel, b['norm_body']))

to_remove = []
for b in resp_blocks:
    norm_sel = re.sub(r'\s+', ' ', b['selector']).strip()
    if (norm_sel, b['norm_body']) in style_set:
        to_remove.append(b)

if to_remove:
    print(f"Found {len(to_remove)} exact duplicate rules in responsive.css.")
    
    # We must remove them from back to front to preserve indices
    to_remove.sort(key=lambda x: x['start_idx'], reverse=True)
    
    for b in to_remove:
        resp_css = resp_css[:b['start_idx']] + resp_css[b['end_idx']:]
        
    with open(resp_file, 'w', encoding='utf-8') as f:
        f.write(resp_css)
    print("Deduplication complete. Overwrote responsive.css")
else:
    print("No exact duplicates found.")
