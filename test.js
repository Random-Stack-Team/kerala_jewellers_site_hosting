const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch();
    
    async function checkPage(url) {
      const page = await browser.newPage();
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 5000 });
      } catch (e) {
        console.log('Timeout on', url);
      }
      
      const data = await page.evaluate(() => {
        return {
          href: window.location.href,
          param: new URLSearchParams(window.location.search).get('category'),
          selectValue: document.querySelector('.collection-toolbar select')?.value,
          total: document.querySelectorAll('.product-card').length,
          hidden: document.querySelectorAll('.product-card[style*=\"display: none\"]').length,
          visible: document.querySelectorAll('.product-card:not([style*=\"display: none\"])').length
        };
      });
      
      console.log('--- URL:', url);
      console.log('1. window.location.href:', data.href);
      console.log('2. URLSearchParams get(category):', data.param);
      console.log('3. select value:', data.selectValue);
      console.log('4. total cards:', data.total);
      console.log('5. hidden cards:', data.hidden);
      console.log('6. visible cards:', data.visible);
      
      await page.close();
    }
    
    await checkPage('http://localhost:3000/products.html?category=bangles');
    await checkPage('http://localhost:3000/silver-products.html?category=anklets');
    await checkPage('http://localhost:3000/diamonds-products.html?category=rings');
    
    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
