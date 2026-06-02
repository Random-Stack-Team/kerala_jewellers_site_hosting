import re

with open('E:\\Kerala-Jewellers-final\\js\\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Helper function to remove a function definition from start to its closing brace
def remove_function(code, func_name):
    # Regex to find `const funcName = () => { ... }` or `function funcName() { ... }`
    pattern = r'(?:const\s+' + func_name + r'\s*=\s*\([^\)]*\)\s*=>\s*\{|function\s+' + func_name + r'\s*\([^\)]*\)\s*\{)'
    match = re.search(pattern, code)
    if not match:
        return code
        
    start_idx = match.start()
    brace_count = 0
    in_string = False
    string_char = ''
    
    # Fast forward to the opening brace
    i = start_idx
    while i < len(code) and code[i] != '{':
        i += 1
        
    # Now parse until the closing brace
    for i in range(i, len(code)):
        char = code[i]
        
        # Handle string literals to avoid counting braces inside strings
        if char in ('"', "'", '`'):
            if not in_string:
                in_string = True
                string_char = char
            elif in_string and string_char == char and code[i-1] != '\\':
                in_string = False
                
        if not in_string:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    # Found the end of the function!
                    # Also remove trailing semicolon or whitespace if any
                    end_idx = i + 1
                    while end_idx < len(code) and code[end_idx] in (' ', '\t', '\n', '\r', ';'):
                        end_idx += 1
                    return code[:start_idx] + code[end_idx:]
                    
    return code

# 1. Remove the function definitions
functions_to_remove = [
    'ensureSimpleMegamenus',
    'cleanDiamondDropdown',
    'cleanNavCategoryPanels',
    'fixSchemeMenuBehavior'
]

for func in functions_to_remove:
    content = remove_function(content, func)

# 2. Remove the function calls in initializeApp
for func in functions_to_remove:
    content = re.sub(r'^\s*' + func + r'\(\);[ \t]*\r?\n?', '', content, flags=re.MULTILINE)

with open('E:\\Kerala-Jewellers-final\\js\\app.js', 'w', encoding='utf-8') as f:
    f.write(content)
    
print("Removed duplicate/dead logic from app.js successfully.")
