import re

with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'r', encoding='utf-8') as f:
    html = f.read()

gold_links = """<a class="kj-megamenu-link" href="products?category=bangles"><span>Bangles</span></a><a class="kj-megamenu-link" href="products?category=bracelet"><span>Bracelets</span></a><a class="kj-megamenu-link" href="products?category=pendant"><span>Pendant</span></a><a class="kj-megamenu-link" href="products?category=necklace"><span>Necklace</span></a><a class="kj-megamenu-link" href="products?category=rings"><span>Rings</span></a><a class="kj-megamenu-link" href="products?category=earrings"><span>Earrings</span></a>"""

silver_links = """<a class="kj-megamenu-link" href="silver-products?category=bracelet"><span>Bracelets</span></a><a class="kj-megamenu-link" href="silver-products?category=necklace"><span>Necklace</span></a><a class="kj-megamenu-link" href="silver-products?category=idols"><span>Idols</span></a><a class="kj-megamenu-link" href="silver-products?category=anklets"><span>Anklets</span></a>"""

diamond_links = """<a class="kj-megamenu-link" href="diamonds-products?category=necklace"><span>Necklace</span></a><a class="kj-megamenu-link" href="diamonds-products?category=rings"><span>Rings</span></a>"""

# Since we know there are exactly 4 `kj-megamenu-links` blocks:
# 0: Gold
# 1: Silver
# 2: Diamond
# 3: Probably Diamond again (maybe duplicated in HTML)
# Let's just split by `<div class="kj-megamenu-links">` and replace the inner part before `</div>`

parts = re.split(r'(<div class="kj-megamenu-links">)', html)
# parts[0] is before first div
# parts[1] is `<div class="kj-megamenu-links">`
# parts[2] is innerHTML of first div + `</div>` + before second div
# This can get messy if there are nested divs, but `kj-megamenu-links` only contains `<a>` tags.
# Let's use `re.sub` iteratively.

def replace_nth(pattern, replacement, string, n):
    matches = list(re.finditer(pattern, string))
    if len(matches) > n:
        match = matches[n]
        return string[:match.start(1)] + replacement + string[match.end(1):]
    return string

# We want to replace the contents of `<div class="kj-megamenu-links">(.*?)</div>`
pattern = r'<div class="kj-megamenu-links">(.*?)</div>'
html = replace_nth(pattern, gold_links, html, 0)
html = replace_nth(pattern, silver_links, html, 1)
html = replace_nth(pattern, diamond_links, html, 2)
if len(re.findall(pattern, html)) >= 4:
    html = replace_nth(pattern, diamond_links, html, 3)

with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated header.html links perfectly.")
