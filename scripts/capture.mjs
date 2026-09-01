import puppeteer from 'puppeteer';

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: 'C:/Users/hakso/.gemini/antigravity/brain/b3298707-ef7c-40c7-a2e9-e61e72aa9692/screenshot_clean_dashboard.png',
    fullPage: false
  });

  await browser.close();
  console.log('SCREENSHOT_CAPTURED_SUCCESSFULLY');
}

capture().catch(err => {
  console.error('CAPTURE_ERROR:', err);
  process.exit(1);
});
