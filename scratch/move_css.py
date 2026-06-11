import os

style_path = r'E:\Kerala-Jewellers-final\css\style.css'
navbar_path = r'E:\Kerala-Jewellers-final\css\navbar.css'

with open(style_path, 'r', encoding='utf-8') as f:
    style_content = f.read()

# Tokenize into blocks tracking braces
# We want to identify @media blocks and standard blocks.
# A robust way without a library:
# Find all top-level statements

def parse_css(css_str):
    blocks = []
    current_block = ""
    brace_depth = 0
    in_comment = False
    
    i = 0
    while i < len(css_str):
        if css_str[i:i+2] == '/*' and not in_comment:
            in_comment = True
            current_block += '/*'
            i += 2
            continue
        if css_str[i:i+2] == '*/' and in_comment:
            in_comment = False
            current_block += '*/'
            i += 2
            continue
            
        if not in_comment:
            if css_str[i] == '{':
                brace_depth += 1
            elif css_str[i] == '}':
                brace_depth -= 1
                if brace_depth == 0:
                    current_block += '}'
                    blocks.append(current_block.strip())
                    current_block = ""
                    i += 1
                    continue
        current_block += css_str[i]
        i += 1
        
    if current_block.strip():
        blocks.append(current_block.strip())
    return blocks

blocks = parse_css(style_content)

targets_move = ['.site-header', '.rate-']
targets_delete = ['.menu-button']

def should_process(block, targets):
    # check if any of targets are in the block BEFORE the first '{' 
    # except for @media blocks where we check inside
    if block.startswith('@media'):
        # For media query, we just check if any target exists anywhere
        for t in targets:
            if t in block: return True
        return False
    else:
        # Standard block
        selector_part = block.split('{')[0]
        for t in targets:
            if t in selector_part: return True
        return False

remaining_blocks = []
moved_blocks = []

moved_count = 0
deleted_count = 0

for block in blocks:
    if not block: continue
    
    # Check if we need to delete
    if should_process(block, targets_delete):
        deleted_count += 1
        continue
        
    # Check if we need to move
    if should_process(block, targets_move):
        # We need to extract the exact sub-blocks if it's an @media block that contains other stuff
        if block.startswith('@media'):
            media_header = block.split('{', 1)[0].strip()
            inner_content = block.split('{', 1)[1].rsplit('}', 1)[0].strip()
            inner_blocks = parse_css(inner_content)
            
            keep_inner = []
            move_inner = []
            for ib in inner_blocks:
                if should_process(ib, targets_delete):
                    deleted_count += 1
                elif should_process(ib, targets_move):
                    move_inner.append(ib)
                    moved_count += 1
                else:
                    keep_inner.append(ib)
                    
            if keep_inner:
                remaining_blocks.append(f"{media_header} {{\n  " + "\n  ".join(keep_inner) + "\n}")
            if move_inner:
                moved_blocks.append(f"{media_header} {{\n  " + "\n  ".join(move_inner) + "\n}")
        else:
            moved_blocks.append(block)
            moved_count += 1
    else:
        remaining_blocks.append(block)

# Reconstruct style.css
new_style = "\n\n".join(remaining_blocks)
with open(style_path, 'w', encoding='utf-8') as f:
    f.write(new_style + "\n")

# Reconstruct navbar.css
with open(navbar_path, 'a', encoding='utf-8') as f:
    f.write("\n\n/* Moved from style.css */\n")
    f.write("\n\n".join(moved_blocks))
    f.write("\n")

print(f"Moved {moved_count} blocks to navbar.css")
print(f"Deleted {deleted_count} blocks")
