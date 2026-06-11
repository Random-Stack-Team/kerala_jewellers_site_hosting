import re
with open(r'E:\Kerala-Jewellers-final\scratch\prod_head.html', 'r', encoding='utf-8') as f:
    head = f.read()

overrides = re.search(r'<style id="final-header-overrides">(.*?)</style>', head, re.DOTALL)
if overrides:
    for line in overrides.group(1).split('\n'):
        if any(x in line for x in ['width', 'height', 'size', 'padding', 'margin']):
            print(line.strip())
