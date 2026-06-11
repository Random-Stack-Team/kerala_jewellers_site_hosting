import re
with open(r'E:\Kerala-Jewellers-final\products.html', 'r', encoding='utf-8') as f:
    prod = f.read()
scripts = re.findall(r'<script id="premium-header-repairs">(.*?)</script>', prod, re.DOTALL)
if scripts:
    print(scripts[0])
