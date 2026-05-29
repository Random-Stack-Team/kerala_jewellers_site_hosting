import re
from bs4 import BeautifulSoup
import json

try:
    with open('index.html', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')
    
    # 1. Scheme dropdown structure
    menus = soup.find_all('div', class_='bko-wrap-111-2')
    for menu in menus:
        link = menu.find('div', class_='bko-dropdown-1-2')
        if link and 'Scheme' in link.text:
            with open('scheme_dropdown.html', 'w', encoding='utf-8') as out:
                out.write(str(menu))
            print("Scheme menu written.")
            
    # 2. Testimonial section
    testimonials = soup.find_all(lambda tag: tag.has_attr('class') and any('testimonial' in c or 'feedback' in c for c in tag['class']))
    if testimonials:
        with open('testimonial_section.html', 'w', encoding='utf-8') as out:
            out.write(str(testimonials[0]))
        print("Testimonial written.")
except Exception as e:
    print(f"Error: {e}")
