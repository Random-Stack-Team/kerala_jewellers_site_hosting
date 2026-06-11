import urllib.request
import re

req = urllib.request.Request('https://www.keralajewellers.in/index.html', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        links = re.findall(r'<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"', html)
        for link in links:
            print(link)
except Exception as e:
    print('Error:', e)
