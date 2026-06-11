import re

with open(r'E:\Kerala-Jewellers-final\products.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find anything that might be a filter button
matches = re.findall(r'<[^>]*class="[^"]*filter[^"]*"[^>]*>.*?<', html, re.IGNORECASE)
print(list(set(matches))[:20])

matches2 = re.findall(r'<[^>]*data-filter[^>]*>.*?<', html, re.IGNORECASE)
print(list(set(matches2))[:20])
