import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to http://localhost:5173/graph/ ...');
  await page.goto('http://localhost:5173/graph/', { waitUntil: 'networkidle2' });

  // 1. Click "Open Visualizer"
  console.log('Entering workspace...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Open Visualizer'));
    if(btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 2. Select a preset graph to ensure everything is mounted
  console.log('Selecting Simple Undirected Graph preset...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const presetBtn = btns.find(b => b.textContent.includes('Simple Undirected Graph') || b.textContent.includes('DIR') || b.textContent.includes('UNDIR'));
    if (presetBtn) presetBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 3. Switch workspace mode to "Algorithms" and select BFS
  console.log('Selecting BFS algorithm...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const algoTab = btns.find(b => b.textContent.trim() === 'Algorithms');
    if (algoTab) algoTab.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const bfsBtn = btns.find(b => b.textContent.includes('BFS'));
    if (bfsBtn) bfsBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 4. Reset window scroll to 0 (top of page)
  console.log('Resetting window scroll to 0...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  
  let initialScrollY = await page.evaluate(() => window.scrollY);
  console.log(`Initial window scrollY: ${initialScrollY}`);

  // 5. Start visualizing BFS
  console.log('Starting BFS visualization playback...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const playBtn = btns.find(b => b.textContent.includes('Visualize') || b.textContent.includes('Play'));
    if (playBtn) playBtn.click();
  });

  // Let it play for a few seconds to let scroll actions execute
  console.log('Waiting for steps to run and trace/code auto-scrolls to trigger...');
  for (let i = 1; i <= 5; i++) {
    await new Promise(r => setTimeout(r, 1000));
    let currentScrollY = await page.evaluate(() => window.scrollY);
    console.log(`[Playback second ${i}] Current window scrollY: ${currentScrollY}`);
    if (currentScrollY > 0) {
      console.error(`FAILURE: Viewport scroll jumped to ${currentScrollY} during playback!`);
      await browser.close();
      process.exit(1);
    }
  }

  // 6. Switch to Code tab during execution and check scrollY
  console.log('Switching to CODE tab during playback...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const codeTab = btns.find(b => b.textContent.trim() === 'Code');
    if (codeTab) codeTab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  let codeScrollY = await page.evaluate(() => window.scrollY);
  console.log(`Window scrollY after switching to CODE tab: ${codeScrollY}`);
  if (codeScrollY > 0) {
    console.error(`FAILURE: Viewport scroll jumped to ${codeScrollY} after switching to CODE tab!`);
    await browser.close();
    process.exit(1);
  }

  // 7. Switch to Trace tab during execution and check scrollY
  console.log('Switching to TRACE tab during playback...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const traceTab = btns.find(b => b.textContent.trim() === 'Trace');
    if (traceTab) traceTab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  let traceScrollY = await page.evaluate(() => window.scrollY);
  console.log(`Window scrollY after switching to TRACE tab: ${traceScrollY}`);
  if (traceScrollY > 0) {
    console.error(`FAILURE: Viewport scroll jumped to ${traceScrollY} after switching to TRACE tab!`);
    await browser.close();
    process.exit(1);
  }

  console.log('SUCCESS: Browser viewport window scroll remained isolated at 0 throughout execution and tab switching!');
  await browser.close();
})();
