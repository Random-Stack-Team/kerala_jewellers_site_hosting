import re

with open('scratch/live_all.css', 'r', encoding='utf-8') as f:
    css = f.read()

selectors_to_find = [
    '.navigation-4', 
    '.navigation-full',
    '.nav-menu-5', 
    '.bko-dropdown-list', 
    '.kj-megamenu-panel', 
    '.navigation-mob', 
    '.mobile-nav',
    '.menu-mob-3',
    '.kj-mobile-rate-strip'
]

# Quick regex to find blocks: selector { ... }
# Handling media queries is trickier, so we'll just find basic blocks first.
def extract_blocks(css_text, selector):
    # Regex to find standard blocks (not inside media queries easily, but will find them)
    # This regex is simplified and might not catch everything perfectly, but good enough for a quick look
    escaped_selector = selector.replace('.', r'\.')
    pattern = r'(?:@media[^{]+\{.*?)?' + escaped_selector + r'\s*\{([^}]+)\}'
    matches = re.finditer(pattern, css_text, re.DOTALL | re.IGNORECASE)
    results = []
    for m in matches:
        # Check if we're inside a media query (very roughly)
        start = max(0, m.start() - 100)
        context = css_text[start:m.start()]
        media = ''
        if '@media' in context:
            media_match = re.search(r'(@media[^\{]+)\{', context)
            if media_match:
                media = media_match.group(1).strip() + ' '
        
        block = m.group(1).strip()
        results.append(f"{media}{selector} {{\n  {block}\n}}")
    return results

with open('scratch/live_extracted.txt', 'w', encoding='utf-8') as f:
    for sel in selectors_to_find:
        f.write(f"=== {sel} ===\n")
        blocks = extract_blocks(css, sel)
        if not blocks:
            # try finding with classes attached e.g. .navigation-4.site-nav
            pass
        for b in blocks:
            f.write(b + "\n\n")
