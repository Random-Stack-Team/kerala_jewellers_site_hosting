import re
with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'r', encoding='utf-8') as f:
    html = f.read()

mobile_links = re.findall(r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>', html, re.DOTALL | re.IGNORECASE)
for href, text in mobile_links:
    clean_text = re.sub(r'<[^>]+>', '', text).strip()
    if clean_text in ['Bangles', 'Chains', 'Rings', 'Necklace', 'Earrings', 'Anklets', 'Pendants']:
        print(f'{clean_text} -> {href}')
