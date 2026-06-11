import urllib.request
import re

req = urllib.request.Request('https://www.keralajewellers.in/index.html', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        match = re.search(r'(<div[^>]*class="[^"]*navigation[^"]*"[^>]*>.*?</nav>\s*</div>\s*</div>\s*</div>)', html, re.DOTALL)
        if match:
            with open('scratch/live_header.html', 'w', encoding='utf-8') as f:
                f.write(match.group(1))
            print('Saved live header to scratch/live_header.html')
        else:
            print('Header not found using regex, saving full html to scratch/live_full.html')
            with open('scratch/live_full.html', 'w', encoding='utf-8') as f:
                f.write(html)
except Exception as e:
    print('Error:', e)
