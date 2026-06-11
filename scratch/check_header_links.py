import re
with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'r', encoding='utf-8') as f:
    html = f.read()

matches = re.findall(r'<a[^>]*href="([^"]*)"[^>]*>.*?<span[^>]*>(.*?)</span>.*?</a>', html, re.DOTALL | re.IGNORECASE)
for href, text in matches:
    print(f'{text.strip()} -> {href}')
