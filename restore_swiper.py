import codecs
html = codecs.open('index.html', 'r', 'utf8').read()
script = '\n<script>\n' + codecs.open('swiper_script.txt', 'r', 'utf8').read() + '</script>\n<script src="js/slider.js"'
if '<script src="js/slider.js"' in html:
    html = html.replace('<script src="js/slider.js"', script)
    codecs.open('index.html', 'w', 'utf8').write(html)
    print("Injected swiper script.")
else:
    print("Could not find slider.js script tag.")
