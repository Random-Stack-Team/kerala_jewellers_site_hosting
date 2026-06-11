import re
with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'r', encoding='utf-8') as f:
    html = f.read()

divs = re.findall(r'<div class="kj-megamenu-links">(.*?)</div>', html, re.DOTALL)
for i, d in enumerate(divs):
    print(f'--- Dropdown {i} ---')
    print(d[:300])

print("\n--- Mobile Nav ---")
mobile_nav = re.search(r'<nav class="mobile-nav[^>]*>(.*?)</nav>', html, re.DOTALL)
if mobile_nav:
    print(mobile_nav.group(1)[:500])
else:
    print("No mobile nav found")
