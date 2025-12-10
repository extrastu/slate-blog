import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { join } from 'path';

const url = process.argv[2];
const outputPath = process.argv[3];

if (!url || !outputPath) {
  console.error('Usage: node screenshot.js <url> <output-path>');
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    // 等待页面完全加载
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true,
    });
    
    writeFileSync(outputPath, screenshot);
    console.log(`Screenshot saved to ${outputPath}`);
  } catch (error) {
    console.error('Error taking screenshot:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();

