import re
with open(r'E:\Kerala-Jewellers-final\products.html', 'r', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\'][^>]*></script>', html)
for s in scripts:
    print(s)
