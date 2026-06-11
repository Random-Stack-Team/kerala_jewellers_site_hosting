import re

with open(r'E:\Kerala-Jewellers-final\products.html', 'r', encoding='utf-8') as f:
    html = f.read()

match = re.search(r'(<div[^>]*class="[^"]*product-card[^"]*"[^>]*>.*?</div>\s*</div>\s*</div>)', html, re.DOTALL | re.IGNORECASE)
if match:
    print(match.group(1)[:1500])
else:
    print("Could not extract a product card.")
