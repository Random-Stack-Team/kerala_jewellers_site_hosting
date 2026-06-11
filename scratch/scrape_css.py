import urllib.request
import re
import os

req = urllib.request.Request('https://www.keralajewellers.in/index.html', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        links = re.findall(r'<link[^>]*href="([^"]+\.css[^"]*)"[^>]*>', html)
        links += re.findall(r'<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"', html)
        # Deduplicate
        links = list(set([l for l in links if 'fonts' not in l]))
        
        all_css = ""
        for link in links:
            if link.startswith('//'):
                url = 'https:' + link
            elif link.startswith('/'):
                url = 'https://www.keralajewellers.in' + link
            elif not link.startswith('http'):
                url = 'https://www.keralajewellers.in/' + link
            else:
                url = link
            
            print(f'Fetching {url}')
            try:
                with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})) as css_res:
                    all_css += css_res.read().decode('utf-8') + "\n"
            except Exception as e:
                print(f"Failed to fetch {url}: {e}")
                
        with open('scratch/live_all.css', 'w', encoding='utf-8') as f:
            f.write(all_css)
        print(f"Saved {len(all_css)} bytes of CSS to scratch/live_all.css")
        
except Exception as e:
    print('Error:', e)
