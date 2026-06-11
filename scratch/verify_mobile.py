import re

with open(r'E:\Kerala-Jewellers-final\partials\header.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace mobile links that are just standard paths.
# Since we just want to update hrefs for specific texts.
# Let's find all <a> tags and if their text is exactly Bangles, replace href.

mappings = {
    'Bangles': 'products.html?category=bangles',
    'Chains': 'products.html?category=chains', # Note: Silver also has Chains!
    'Rings': 'products.html?category=rings',   # Silver & Diamond also have Rings!
    'Necklace': 'products.html?category=necklace',
    'Earrings': 'products.html?category=earrings',
    'Anklets': 'silver-products.html?category=anklets',
    'Pendants': 'silver-products.html?category=pendants'
}

# The mobile menu is typically inside a specific div.
# But actually, `apply_header_fixes.py` ONLY touched `<div class="dropdown"...>` which had `goldlink`, `silverlink`.
# What if we just do a string replacement on the exact `href="products.html"` when the link contains specific texts?
# But we need to distinguish Gold Chains from Silver Chains.

# Instead of regexing all, let's just find the exact occurrences of the mobile menu.
# We know they are somewhere in the HTML.
mobile_section = re.search(r'(<nav class="mobile-nav[^>]*>.*?</nav>)', html, re.DOTALL)
if not mobile_section:
    # If no mobile-nav, maybe it's `.site-nav__panel`
    mobile_section = re.search(r'(<div class="site-nav__panel[^>]*>.*?</div>\s*</div>\s*</div>)', html, re.DOTALL)

# Let's just find the links we printed earlier!
# We printed:
# Bangles -> products.html?category=bangles
# Chains -> products.html?category=chains
# Wait... earlier `check_mobile.py` printed:
# Bangles -> products.html?category=bangles
# Chains -> products.html?category=chains
# Anklets -> silver-products.html?category=anklets
# Rings -> silver-products.html?category=rings
# ...
# This means my script apply_header_fixes.py DID REPLACE THEM!
# Wait! How did it replace them if they weren't in the dropdown?
# BECAUSE `apply_header_fixes.py` didn't constrain to dropdowns properly or the mobile menu ALSO uses `goldlink`!
# Let's verify `check_mobile.py` output again!
