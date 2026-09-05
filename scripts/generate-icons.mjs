import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const browser = await puppeteer.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const sizes = [16, 32, 48, 128];
  const svgPath = path.resolve('public/icons/icon.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf-8');

  for (const size of sizes) {
    const page = await browser.newPage();
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: ${size}px; height: ${size}px; background: transparent; overflow: hidden; display: flex; align-items: center; justify-content: center; }
            svg { width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
      </html>
    `;

    await page.setContent(html);
    const outputPath = path.resolve(`public/icons/icon${size}.png`);
    await page.screenshot({
      path: outputPath,
      omitBackground: true
    });
    await page.close();
    console.log(`Generated: icon${size}.png`);
  }

  await browser.close();
  console.log('ALL_ICONS_GENERATED');
}

generateIcons().catch(err => {
  console.error('ICON_GEN_ERROR:', err);
  process.exit(1);
});
