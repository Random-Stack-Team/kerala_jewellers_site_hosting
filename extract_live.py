import re
from bs4 import BeautifulSoup

try:
    with open('live_site.html', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')
    
    menus = soup.select('.bko-dropdown-list, .dropdown-list')
    print(f"Found {len(menus)} dropdown menus in live site.")
    for i, menu in enumerate(menus):
        img = menu.select_one('img.slide__image, img')
        if img:
            print(f"Menu {i} Image: {img.get('src')}")
            
    # Also grab customer feedback section to compare
    feedback = soup.select_one('.testimonial-section, [class*="testimonial"], [class*="feedback"]')
    if feedback:
        with open('live_testimonial.html', 'w', encoding='utf-8') as out:
            out.write(str(feedback))
        print("Live testimonial written.")
except Exception as e:
    print(f"Error: {e}")
