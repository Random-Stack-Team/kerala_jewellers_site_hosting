import re

with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Define the exact links required:
gold_links = """<a class="kj-megamenu-link" href="products?category=bangles"><span>Bangles</span></a>
<a class="kj-megamenu-link" href="products?category=bracelet"><span>Bracelets</span></a>
<a class="kj-megamenu-link" href="products?category=pendant"><span>Pendant</span></a>
<a class="kj-megamenu-link" href="products?category=necklace"><span>Necklace</span></a>
<a class="kj-megamenu-link" href="products?category=rings"><span>Rings</span></a>
<a class="kj-megamenu-link" href="products?category=earrings"><span>Earrings</span></a>"""

silver_links = """<a class="kj-megamenu-link" href="silver-products?category=bracelet"><span>Bracelets</span></a>
<a class="kj-megamenu-link" href="silver-products?category=necklace"><span>Necklace</span></a>
<a class="kj-megamenu-link" href="silver-products?category=idols"><span>Idols</span></a>
<a class="kj-megamenu-link" href="silver-products?category=anklets"><span>Anklets</span></a>"""

diamond_links = """<a class="kj-megamenu-link" href="diamonds-products?category=necklace"><span>Necklace</span></a>
<a class="kj-megamenu-link" href="diamonds-products?category=rings"><span>Rings</span></a>"""

def replace_links(html):
    # We have three sets of links: desktop (in dropdowns) and mobile (in mobile-nav or similar).
    # To replace them safely, we need to locate the dropdown blocks and the mobile blocks.
    
    # 1. Desktop dropdowns. They have classes like `goldlink`, `silverlink`, `diamondlink` or similar.
    # Alternatively, Webflow mega menus have `<div class="bko-grid-1-3-1"...>`
    # We will find the sequence of `kj-megamenu-link` or any `<a>` tags in those blocks.
    
    # Gold Desktop
    html = re.sub(r'(<div[^>]*goldlink[^>]*>.*?(?:kj-megamenu-links|<div class="bko-grid-1-3-1"[^>]*>.*?<div[^>]*>).*?)(<a[^>]*>.*?</a>\s*)+(.*?(?:</div>)+)', r'\g<1>' + gold_links.replace('\n', '') + r'\g<3>', html, count=1, flags=re.DOTALL)
    
    # Silver Desktop
    html = re.sub(r'(<div[^>]*silverlink[^>]*>.*?(?:kj-megamenu-links|<div class="bko-grid-1-3-1"[^>]*>.*?<div[^>]*>).*?)(<a[^>]*>.*?</a>\s*)+(.*?(?:</div>)+)', r'\g<1>' + silver_links.replace('\n', '') + r'\g<3>', html, count=1, flags=re.DOTALL)
    
    # Diamond Desktop
    html = re.sub(r'(<div[^>]*diamondlink[^>]*>.*?(?:kj-megamenu-links|<div class="bko-grid-1-3-1"[^>]*>.*?<div[^>]*>).*?)(<a[^>]*>.*?</a>\s*)+(.*?(?:</div>)+)', r'\g<1>' + diamond_links.replace('\n', '') + r'\g<3>', html, count=1, flags=re.DOTALL)
    
    return html

html = replace_links(html)

# Now what about mobile?
# Mobile links are usually inside `<nav class="mobile-nav"...>` or `<div class="site-nav__panel"...>`
# Let's find the blocks of <a> tags that match Gold/Silver/Diamond categories in mobile.
# Actually, since the links are unique texts, let's just find the parent element that contains them.
# The mobile menus are usually dropdowns too. Let's just find the `kj-megamenu-link` sequences that weren't replaced.
# Wait, if they are exactly the same, maybe there's a mobile container.
# Let's just print out how many `kj-megamenu-link` blocks we have left.

with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated header.html")
