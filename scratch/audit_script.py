import os, re, glob, json
from collections import defaultdict

css_files = glob.glob(r'E:\Kerala-Jewellers-final\css\*.css')
js_files = glob.glob(r'E:\Kerala-Jewellers-final\js\*.js')
html_files = glob.glob(r'E:\Kerala-Jewellers-final\*.html')

audit = {
    'css_dup': [],
    'css_comments': [],
    'important_counts': {},
    'js_dup': [],
    'html_headers': defaultdict(list)
}

# 1. CSS Audit
comment_keywords = ['patch', 'emergency', 'restore', 'correction', 'override', 'guard', 'final fix', 'hotfix', 'temporary', 'workaround']

for f in css_files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            # Important count
            audit['important_counts'][os.path.basename(f)] = content.count('!important')
            
            # Comments
            comments = re.findall(r'/\*.*?\*/', content, re.DOTALL)
            for c in comments:
                lower_c = c.lower()
                for kw in comment_keywords:
                    if kw in lower_c:
                        audit['css_comments'].append({'file': os.path.basename(f), 'keyword': kw, 'comment': c.strip()[:100]})
                        
            # Duplicate selectors basic check
            selectors = re.findall(r'([^}{]+)\s*\{', content)
            cleaned = [s.strip().replace('\n', '') for s in selectors if s.strip() and not s.strip().startswith('@')]
            counts = defaultdict(int)
            for s in cleaned: counts[s] += 1
            dups = {k: v for k, v in counts.items() if v > 1}
            if dups:
                audit['css_dup'].append({'file': os.path.basename(f), 'dups': len(dups)})
    except Exception as e:
        pass

# 2. JS Audit
for f in js_files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            dom_loads = content.count('DOMContentLoaded')
            clicks = len(re.findall(r'\.addEventListener\([\'"]click[\'"]', content))
            audit['js_dup'].append({'file': os.path.basename(f), 'dom_loads': dom_loads, 'clicks': clicks})
    except:
        pass

# 3. HTML Audit
for f in html_files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            header = re.search(r'<header[^>]*>.*?</header>', content, re.DOTALL)
            if header:
                h_len = len(header.group(0))
                audit['html_headers'][h_len].append(os.path.basename(f))
    except:
        pass

with open(r'E:\Kerala-Jewellers-final\scratch\audit_results.json', 'w') as out:
    json.dump(audit, out, indent=2)
