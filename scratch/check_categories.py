import re
with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'r', encoding='utf-8') as f:
    html = f.read()

links = re.findall(r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>', html, re.DOTALL | re.IGNORECASE)
for href, text in links:
    clean_text = re.sub(r'<[^>]+>', '', text).strip()
    if clean_text in ['Bangles', 'Bracelets', 'Pendant', 'Necklace', 'Rings', 'Earrings', 'Idols', 'Anklets']:
        print(f'{clean_text} -> {href}')
