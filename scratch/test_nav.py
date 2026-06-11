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

print(f"Using port {port}")

options = Options()
options.add_argument('--headless')
driver = webdriver.Chrome(options=options)

try:
    print("\n--- TEST: Homepage to Products ---")
    driver.get(f"http://localhost:{port}/index.html")
    
    # Wait for header to inject
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '.kj-megamenu-link[href*="bangles"]'))
    )
    
    bangles_link = driver.find_element(By.CSS_SELECTOR, '.kj-megamenu-link[href*="bangles"]')
    href = bangles_link.get_attribute("href")
    print(f"Rendered href after header injection: {href}")
    
    driver.execute_script("arguments[0].click();", bangles_link)
    
    time.sleep(2)
    print(f"Final URL after click: {driver.current_url}")

    print("\n--- TEST: Products to Products (Same Page Filter) ---")
    driver.get(f"http://localhost:{port}/products.html")
    
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '.kj-megamenu-link[href*="chains"]'))
    )
    
    chains_link = driver.find_element(By.CSS_SELECTOR, '.kj-megamenu-link[href*="chains"]')
    href2 = chains_link.get_attribute("href")
    print(f"Rendered href after header injection: {href2}")
    
    driver.execute_script("arguments[0].click();", chains_link)
    
    time.sleep(2)
    print(f"Final URL after click: {driver.current_url}")

finally:
    driver.quit()
