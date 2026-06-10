import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/graph', { waitUntil: 'networkidle2' });
  
  // Click Add Vertex
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Add Vertex'));
    if(btn) btn.click();
  });
  
  // Type Z
  await page.type('input[placeholder="e.g. Z"]', 'Z');
  
  // Click Visualize
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Visualize'));
    if(btn) btn.click();
  });
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 2000));
  
  // Check DOM
  const content = await page.content();
  if (content.includes('>Z</text>')) {
    console.log('SUCCESS: Z is in the DOM!');
  } else {
    console.log('FAILURE: Z is NOT in the DOM!');
  }
  
  await browser.close();
})();
