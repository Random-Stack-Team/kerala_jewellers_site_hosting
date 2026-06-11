from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import urllib.request

port = 3000
for p in [3000, 5000, 8080]:
    try:
        urllib.request.urlopen(f"http://localhost:{p}")
        port = p
        break
    except:
        pass

options = Options()
options.add_argument('--headless')
driver = webdriver.Chrome(options=options)

try:
    print(f"--- TEST: Same Page Filter with .html ---")
    driver.get(f"http://localhost:{port}/products.html")
    
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '.kj-megamenu-link[href*="pendant"]'))
    )
    
    pendant_link = driver.find_element(By.CSS_SELECTOR, '.kj-megamenu-link[href*="pendant"]')
    print(f"Pendant link href: {pendant_link.get_attribute('href')}")
    
    driver.execute_script("arguments[0].click();", pendant_link)
    
    time.sleep(2)
    print(f"Final URL after click: {driver.current_url}")
    
    visible_cards = driver.find_elements(By.CSS_SELECTOR, '.product-card:not([hidden])')
    categories = list(set([card.get_attribute("data-category") for card in visible_cards]))
    print(f"Visible cards only pendants? {categories == ['pendant']}")
    
finally:
    driver.quit()
