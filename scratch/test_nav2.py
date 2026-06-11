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
    print(f"--- TEST: Homepage to Products ---")
    driver.get(f"http://localhost:{port}/index.html")
    
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '.kj-megamenu-link[href*="bangles"]'))
    )
    
    bangles_link = driver.find_element(By.CSS_SELECTOR, '.kj-megamenu-link[href*="bangles"]')
    href = bangles_link.get_attribute("href")
    original_href = bangles_link.get_attribute("href") # actually what's rendered
    print(f"Rendered href after header injection: {href}")
    
    driver.execute_script("arguments[0].click();", bangles_link)
    
    time.sleep(2)
    current_url = driver.current_url
    print(f"Final URL after click: {current_url}")
    
    # Check filter
    visible_cards = driver.find_elements(By.CSS_SELECTOR, '.product-card:not([hidden])')
    categories = list(set([card.get_attribute("data-category") for card in visible_cards]))
    print(f"URL category = bangles? {'category=bangles' in current_url}")
    print(f"Visible cards only bangles? {categories == ['bangles']}")

    print(f"\n--- TEST: Products to Products (Same Page Filter) ---")
    driver.get(f"http://localhost:{port}/products") # Clean URL
    
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '.kj-megamenu-link[href*="chains"]'))
    )
    
    chains_link = driver.find_element(By.CSS_SELECTOR, '.kj-megamenu-link[href*="chains"]')
    print(f"Rendered href after header injection: {chains_link.get_attribute('href')}")
    
    driver.execute_script("arguments[0].click();", chains_link)
    
    time.sleep(2)
    print(f"Final URL after click: {driver.current_url}")
    visible_cards = driver.find_elements(By.CSS_SELECTOR, '.product-card:not([hidden])')
    categories = list(set([card.get_attribute("data-category") for card in visible_cards]))
    print(f"Visible cards only chains? {categories == ['chain']}") # app.js maps chains -> chain

finally:
    driver.quit()
