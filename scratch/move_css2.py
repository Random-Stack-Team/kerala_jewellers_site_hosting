import re

style_path = r'E:\Kerala-Jewellers-final\css\style.css'
navbar_path = r'E:\Kerala-Jewellers-final\css\navbar.css'

with open(style_path, 'r', encoding='utf-8') as f:
    css = f.read()

def find_blocks(css_text, targets):
    # Regex to find standard blocks and media query blocks.
    # We will just search for the targets in the file.
    
    # Let's find every occurrence of the target
    results = []
    
    for target in targets:
        # find all indices of target
        idx = 0
        while True:
            idx = css_text.find(target, idx)
            if idx == -1: break
            
            # Now we have found the target. We need to find the start of its rule and the end of its rule.
            # Start of rule is the previous '}' or ';' or '{' or start of string?
            # Actually, to find the rule, let's trace backwards to the start of the selector.
            start_idx = idx
            while start_idx > 0 and css_text[start_idx-1] not in '}':
                start_idx -= 1
            
            # It might be inside a media query! If it is, tracing back to '}' might hit the previous rule inside the media query.
            # So start_idx would be just after the previous rule.
            
            idx += 1 # advance to not infinite loop

    pass

# A much safer approach: use the Python cssutils package.
