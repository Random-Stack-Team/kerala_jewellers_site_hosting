import re

with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace Gold links
gold_links = """<a class="kj-megamenu-link" href="products.html?category=bangles"><span>Bangles</span></a><a class="kj-megamenu-link" href="products.html?category=chains"><span>Chains</span></a><a class="kj-megamenu-link" href="products.html?category=rings"><span>Rings</span></a><a class="kj-megamenu-link" href="products.html?category=necklace"><span>Necklace</span></a><a class="kj-megamenu-link" href="products.html?category=earrings"><span>Earrings</span></a>"""
html = re.sub(r'(<div class="kj-megamenu-links"[^>]*>).*?(</div>)', r'\g<1>' + gold_links + r'\g<2>', html, count=1)

# Wait! If there are multiple `kj-megamenu-links` divs, the first one is Gold.
# The second one is Silver?
# Let's see how many there are.
