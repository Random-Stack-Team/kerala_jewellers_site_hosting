import re

with open(r'E:\Kerala-Jewellers-final\products.html', 'r', encoding='utf-8') as f:
    prod = f.read()

# Extract header block precisely
header_start = prod.find('<header class="site-header')
header_end = prod.find('</header>') + 9
header_block = prod[header_start:header_end]

# Extract style block precisely
style_start = prod.find('<style id="final-header-overrides">')
style_end = prod.find('</style>', style_start) + 8
style_block = prod[style_start:style_end]

with open(r'E:\Kerala-Jewellers-final\index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

idx_header_start = idx.find('<header class="site-header')
idx_header_end = idx.find('</header>') + 9

# Replace header block
idx_new = idx[:idx_header_start] + header_block + idx[idx_header_end:]

# Add style block if not present
if '<style id="final-header-overrides">' not in idx_new:
    idx_new = idx_new.replace('</head>', '\n' + style_block + '\n</head>')

with open(r'E:\Kerala-Jewellers-final\index.html', 'w', encoding='utf-8') as f:
    f.write(idx_new)

print('Successfully synced index.html with products.html header and inline styles.')
