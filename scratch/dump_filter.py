import re

with open(r'E:\Kerala-Jewellers-final\products.html', 'r', encoding='utf-8') as f:
    html = f.read()

match = re.search(r'<section class="section_mul-filter">(.*?)</section>', html, re.DOTALL)
if match:
    print(match.group(1)[:1500])
