import re

with open(r'E:\Kerala-Jewellers-final\products.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("File length:", len(html))
print("First 200 chars:", html[:200])

cards = re.findall(r'<div class="([^"]*product[^"]*)"', html)
print("Product div classes (unique):", list(set(cards))[:10])

# Check for category filters
print("Contains category=bangles?", "category=bangles" in html)
print("Contains data-category?", "data-category" in html)
print("Contains filter?", "filter" in html)
