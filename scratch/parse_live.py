from bs4 import BeautifulSoup
import sys

with open(r'E:\Kerala-Jewellers-final\scratch\live_header.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
def print_tree(el, indent=''):
    if el.name:
        classes = '.'.join(el.get('class', []))
        print(f'{indent}<{el.name} class="{classes}">')
        for child in el.children:
            print_tree(child, indent + '  ')
            
original_stdout = sys.stdout
with open(r'E:\Kerala-Jewellers-final\scratch\live_tree.txt', 'w', encoding='utf-8') as f:
    sys.stdout = f
    print_tree(soup)
    sys.stdout = original_stdout
