import re
with open(r'E:\Kerala-Jewellers-final\products.html', 'r', encoding='utf-8') as f:
    prod = f.read()

header = re.search(r'(<header class="site-header.*?</header>)', prod, re.DOTALL)
if header:
    with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'w', encoding='utf-8') as f:
        f.write(header.group(1))
    print('Header extracted successfully.')
else:
    print('Failed to extract header.')
