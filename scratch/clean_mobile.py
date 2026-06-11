import re
with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'(class="kj-mobile-menu-link"[^>]*href="[^"]*?)\.html(")', r'\1\2', html)

with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'w', encoding='utf-8') as f:
    f.write(html)
