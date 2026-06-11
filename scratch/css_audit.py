import re
import json

header_html_path = r'E:\Kerala-Jewellers-final\partials\header.html'
style_css_path = r'E:\Kerala-Jewellers-final\css\style.css'

with open(header_html_path, 'r', encoding='utf-8') as f:
    header_html = f.read()

# Extract all classes used in header.html
class_matches = re.findall(r'class="([^"]+)"', header_html)
header_classes = set()
for m in class_matches:
    for c in m.split():
        header_classes.add(c)

with open(style_css_path, 'r', encoding='utf-8') as f:
    style_css = f.read()

# Targets to search
targets = ['.site-header', '.navbar', '.nav-menu', '.dropdown', '.dropdown-list', '.menu-button', '.w-nav', '.w-dropdown', '.bko-', '.rate-']

rules = re.findall(r'([^{]+)\{([^}]*)\}', style_css)

found_selectors = []
for selectors_str, _ in rules:
    selectors = [s.strip() for s in selectors_str.split(',')]
    for selector in selectors:
        for t in targets:
            if t in selector:
                # Basic check if the class in selector is used in header.html
                # For a better check, extract all classes from the selector
                sel_classes = re.findall(r'\.([a-zA-Z0-9_-]+)', selector)
                is_used = any(c in header_classes for c in sel_classes) if sel_classes else False
                
                # Special cases: .bko-* and .rate-* might match broadly.
                # If t is a prefix, we should check if any class in the selector starts with it and is in header
                if t.endswith('-'):
                    prefix_class = t.replace('.', '')
                    # check if any class in header_classes starts with this prefix and is in the selector
                    is_used = any((h in selector) for h in header_classes if h.startswith(prefix_class))

                found_selectors.append({
                    'selector': selector,
                    'is_used': is_used,
                    'target_matched': t
                })
                break

# Deduplicate
unique_results = {}
for item in found_selectors:
    sel = item['selector']
    # If a selector appears multiple times, if any is_used is True, keep it True
    if sel not in unique_results:
        unique_results[sel] = item
    else:
        unique_results[sel]['is_used'] = unique_results[sel]['is_used'] or item['is_used']

out_data = []
for item in unique_results.values():
    out_data.append(item)

with open('scratch/css_audit.json', 'w', encoding='utf-8') as f:
    json.dump(out_data, f, indent=2)

print(f"Processed {len(out_data)} selectors.")
