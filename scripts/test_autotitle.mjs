import puppeteer from 'puppeteer';

async function testAutoTitle() {
  const browser = await puppeteer.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 600));

  // Open modal
  await page.click('button.btn-primary');
  await new Promise(r => setTimeout(r, 400));

  // Type URL
  const urlInput = await page.$('input[placeholder*="naver.com"]');
  if (urlInput) {
    await urlInput.type('https://github.com');
  }

  // Wait for title auto-fetch
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: 'C:/Users/hakso/.gemini/antigravity/brain/b3298707-ef7c-40c7-a2e9-e61e72aa9692/screenshot_modal_autotitle.png',
    fullPage: false
  });

  const titleVal = await page.$eval('input[placeholder*="자동으로"]', el => el.value);
  console.log('AUTO_FETCHED_TITLE_VALUE:', titleVal);

  await browser.close();
}

testAutoTitle().catch(err => {
  console.error('TEST_ERROR:', err);
  process.exit(1);
});
