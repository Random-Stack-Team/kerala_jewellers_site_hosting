import re

with open(r'E:\Kerala-Jewellers-final\index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

dh = re.search(r'(<div[^>]*class="[^"]*desktop-header[^"]*"[^>]*>)', idx)
print('Index Desktop header:', dh.group(1))

brand = re.search(r'(<img[^>]*src="[^"]*logo[^>]*>)', idx)
print('Index Brand img:', brand.group(1))

with open(r'E:\Kerala-Jewellers-final\products.html', 'r', encoding='utf-8') as f:
    prod = f.read()

dh2 = re.search(r'(<div[^>]*class="[^"]*desktop-header[^"]*"[^>]*>)', prod)
print('\nProd Desktop header:', dh2.group(1))

brand2 = re.search(r'(<img[^>]*src="[^"]*logo[^>]*>)', prod)
print('Prod Brand img:', brand2.group(1))
