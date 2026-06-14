const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
      await page.goto('http://127.0.0.1:8080/contact.html', { waitUntil: 'networkidle' });
      
      const iframes = await page.evaluate(() => {
        return [...document.querySelectorAll('iframe')].map((f, i) => ({ i, src: f.src }));
      });
      
      console.log('--- Iframes found on live server ---');
      console.log(JSON.stringify(iframes, null, 2));
      
      const csp = await page.evaluate(() => {
        return document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content;
      });
      console.log('CSP:', csp);
  } catch(e) {
      console.log('Error hitting local server:', e.message);
  }
  
  await browser.close();
})();
