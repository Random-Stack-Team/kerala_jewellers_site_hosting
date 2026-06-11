import re
import os

base_dir = r'E:\Kerala-Jewellers-final'
header_path = os.path.join(base_dir, 'partials', 'header.html')

with open(header_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace Gold links
gold_links = """<a class="kj-megamenu-link" href="products.html?category=bangles"><span>Bangles</span></a><a class="kj-megamenu-link" href="products.html?category=chains"><span>Chains</span></a><a class="kj-megamenu-link" href="products.html?category=rings"><span>Rings</span></a><a class="kj-megamenu-link" href="products.html?category=necklace"><span>Necklace</span></a><a class="kj-megamenu-link" href="products.html?category=earrings"><span>Earrings</span></a>"""
# Replace Silver links
silver_links = """<a class="kj-megamenu-link" href="silver-products.html?category=anklets"><span>Anklets</span></a><a class="kj-megamenu-link" href="silver-products.html?category=rings"><span>Rings</span></a><a class="kj-megamenu-link" href="silver-products.html?category=chains"><span>Chains</span></a><a class="kj-megamenu-link" href="silver-products.html?category=pendants"><span>Pendants</span></a><a class="kj-megamenu-link" href="silver-products.html?category=necklace"><span>Necklace</span></a>"""
# Replace Diamond links
diamond_links = """<a class="kj-megamenu-link" href="diamonds-products.html?category=rings"><span>Rings</span></a><a class="kj-megamenu-link" href="diamonds-products.html?category=earrings"><span>Earrings</span></a><a class="kj-megamenu-link" href="diamonds-products.html?category=necklace"><span>Necklace</span></a>"""

# Since Webflow generated the structure, let's find the dropdown lists.
# Gold is usually the first dropdown. Silver is second. Diamond is third.
# Let's replace the innerHTML of `kj-megamenu-links` if they exist.
# Wait, my previous search showed `kj-megamenu-links` only matched Gold?
# If `kj-megamenu-links` doesn't exist for Silver, maybe it's `dropdown-list` or something else?
# Let's look at `partials/header.html` more robustly.

# I will use a regex to replace the entire <a> sequence inside the specific dropdowns.
# We know the dropdowns are `goldlink-2`, `silverlink-2`, `diamondlink-2`.
def replace_links_in_dropdown(html, link_class, new_links):
    # Find the dropdown content
    pattern = rf'(<div[^>]*{link_class}[^>]*>.*?(?:kj-megamenu-links|<div class="bko-grid-1-3-1"[^>]*>.*?<div[^>]*>).*?)(<a[^>]*>.*?</a>)+(.*?(?:</div>)+)'
    
    # Actually, let's do a more robust string manipulation:
    # Find the block starting with link_class
    start_idx = html.find(link_class)
    if start_idx == -1: return html
    
    # We want to replace the sequence of <a> tags inside the column.
    # We can use a regex to find all <a...>...</a> inside the dropdown and replace them, 
    # but we need to limit it to the category column.
    # A safer way: Webflow puts them inside a column before the slider.
    # Let's find the first sequence of 2 or more <a> tags inside the dropdown.
    dropdown_start = html.rfind('<div class="dropdown"', 0, start_idx)
    if dropdown_start == -1:
        dropdown_start = html.rfind('<div', 0, start_idx)
        
    dropdown_end = html.find('</div></div></div></div>', start_idx) # Rough approximation
    if dropdown_end == -1: dropdown_end = len(html)
    
    sub = html[dropdown_start:dropdown_end]
    
    # Replace the block of <a> tags that are siblings
    # Looking for a group of <a...>...</a>
    sub_replaced = re.sub(r'(<a[^>]*kj-megamenu-link[^>]*>.*?</a>)+', new_links, sub, flags=re.DOTALL)
    if sub_replaced == sub:
        # Maybe they don't have kj-megamenu-link class?
        sub_replaced = re.sub(r'(<a[^>]*href=[^>]*>.*?<span[^>]*>.*?</span>.*?</a>)+', new_links, sub, flags=re.DOTALL)
        
    return html[:dropdown_start] + sub_replaced + html[dropdown_end:]

html = replace_links_in_dropdown(html, 'goldlink', gold_links)
html = replace_links_in_dropdown(html, 'silverlink', silver_links)
html = replace_links_in_dropdown(html, 'diamondlink', diamond_links)

with open(header_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated header.html links.")

# Now let's bump the version in all HTML files so the user gets the new app.js!
files_to_update = [
    'index.html',
    'products.html',
    'silver-products.html',
    'diamonds-products.html',
    'about.html',
    'contact.html'
]
for fname in files_to_update:
    path = os.path.join(base_dir, fname)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = re.sub(r'app\.js\?v=kj-hard-refresh-23', 'app.js?v=kj-hard-refresh-24', content)
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Bumped version in {fname}")
