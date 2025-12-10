import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const postsDir = 'src/content/post';
const publicDir = 'public';

// 从文章内容中提取链接
function extractUrl(content) {
  // 尝试从 :::info 块中提取链接
  const infoMatch = content.match(/:::info[^:]*\[([^\]]+)\]\(([^)]+)\)/);
  if (infoMatch) {
    return infoMatch[2];
  }
  
  // 尝试从第一个链接中提取
  const linkMatch = content.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (linkMatch) {
    return linkMatch[2];
  }
  
  return null;
}

// 检查文章是否已有头图
function hasHeaderImage(content) {
  // 检查 frontmatter 之后是否有图片
  const afterFrontmatter = content.split('---\n\n')[1] || '';
  return /^!\[/.test(afterFrontmatter.trim());
}

// 截图函数
async function takeScreenshot(url, outputPath) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true,
    });
    
    writeFileSync(outputPath, screenshot);
    console.log(`✓ Screenshot saved: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`✗ Error taking screenshot for ${url}:`, error.message);
    return false;
  } finally {
    await browser.close();
  }
}

// 处理单个文章
async function processPost(filename) {
  const filePath = join(postsDir, filename);
  const content = readFileSync(filePath, 'utf-8');
  
  // 检查是否已有头图
  if (hasHeaderImage(content)) {
    console.log(`⏭  Skipping ${filename} (already has header image)`);
    return;
  }
  
  // 提取链接
  const url = extractUrl(content);
  if (!url) {
    console.log(`⚠  No URL found in ${filename}`);
    return;
  }
  
  // 生成截图文件名
  const slug = filename.replace('.md', '');
  const screenshotPath = join(publicDir, `${slug}-screenshot.png`);
  
  console.log(`📸 Processing ${filename}...`);
  console.log(`   URL: ${url}`);
  
  // 截图
  const success = await takeScreenshot(url, screenshotPath);
  if (!success) {
    return;
  }
  
  // 在文章开头添加图片
  const parts = content.split('---\n\n');
  if (parts.length < 2) {
    console.log(`⚠  Invalid frontmatter in ${filename}`);
    return;
  }
  
  const frontmatter = parts[0] + '---';
  const body = parts.slice(1).join('---\n\n');
  
  // 获取文章标题用于图片 alt 文本
  const titleMatch = frontmatter.match(/title:\s*(.+)/);
  const title = titleMatch ? titleMatch[1].trim() : slug;
  
  const newContent = `${frontmatter}\n\n![${title} 首页截图](/${slug}-screenshot.png)\n\n${body}`;
  
  writeFileSync(filePath, newContent);
  console.log(`✓ Updated ${filename} with header image\n`);
}

// 主函数
async function main() {
  const files = readdirSync(postsDir).filter(f => f.endsWith('.md'));
  
  console.log(`Found ${files.length} markdown files\n`);
  
  for (const file of files) {
    await processPost(file);
    // 添加延迟避免过快请求
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('Done!');
}

main().catch(console.error);

