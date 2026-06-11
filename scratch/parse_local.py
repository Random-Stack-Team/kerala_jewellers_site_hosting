from bs4 import BeautifulSoup
import sys

with open(r'E:\Kerala-Jewellers-final\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

def print_tree(el, indent=''):
    if el.name:
        classes = '.'.join(el.get('class', []))
        print(f'{indent}<{el.name} class="{classes}">')
        for child in el.children:
            print_tree(child, indent + '  ')

header = soup.find('div', role='banner')
if header:
    original_stdout = sys.stdout
    with open(r'E:\Kerala-Jewellers-final\scratch\local_tree.txt', 'w', encoding='utf-8') as f:
        sys.stdout = f
        print_tree(header.parent)  # grab the wrapper too
        sys.stdout = original_stdout
else:
    print('No header role=banner found')
