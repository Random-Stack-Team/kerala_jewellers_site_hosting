import re
with open(r'E:\Kerala-Jewellers-final\css\style.css', 'r', encoding='utf-8') as f:
    css = f.read()

targets = ['.site-header', '.navbar', '.dropdown', '.dropdown-list', '.nav-menu', '.menu-button', '.bko-dropdown-list', '.rate-dropdown']

rules = re.findall(r'([^{]+)\{([^}]*)\}', css)

found = {}
for selectors, body in rules:
    selectors = selectors.strip().replace('\n', ' ')
    for target in targets:
        if re.search(r'(^|\s|,|>|\+)' + re.escape(target) + r'(?![a-zA-Z0-9_-])', selectors):
            if target not in found: found[target] = []
            found[target].append({'selector': selectors, 'body': body.strip()})

with open('style_audit.txt', 'w', encoding='utf-8') as out:
    for target, rules_list in found.items():
        out.write(f'\n--- TARGET: {target} ---\n')
        for r in rules_list:
            body_sample = r['body'].replace('\n', ' ')
            out.write(f"{r['selector']}: {{ {body_sample} }}\n")
