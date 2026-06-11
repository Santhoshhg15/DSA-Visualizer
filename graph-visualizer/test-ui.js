import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/graph/', { waitUntil: 'networkidle2' });

  // Click Open Visualizer to enter the workspace
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Open Visualizer'));
    if(btn) btn.click();
  });

  // Wait for layout transition to workspace view
  await new Promise(r => setTimeout(r, 1000));

  // Select a preset graph (e.g. click first button with 'DIR' or 'UNDIR' indicator)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const presetBtn = btns.find(b => b.textContent.includes('DIR') || b.textContent.includes('UNDIR'));
    if (presetBtn) presetBtn.click();
  });

  // Wait for preset to load and operations panel to mount
  await new Promise(r => setTimeout(r, 1000));
  
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
