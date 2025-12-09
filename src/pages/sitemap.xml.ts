import type { APIRoute } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import slateConfig from '~@/slate.config';

export const GET: APIRoute = async () => {
  const site = slateConfig.site || '';
  
  // 获取所有非草稿文章
  const posts = await getCollection('post', (entry: CollectionEntry<'post'>) => {
    return import.meta.env.DEV || entry.data.draft !== true;
  });

  // 生成文章 URL
  const postUrls = posts.map((post) => ({
    loc: `${site}/blog/${post.slug}`,
    lastmod: post.data.pubDate?.toISOString() || new Date().toISOString(),
    changefreq: 'monthly' as const,
    priority: 0.8,
  }));

  // 静态页面
  const staticPages = [
    {
      loc: `${site}/`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily' as const,
      priority: 1.0,
    },
  ];

  // 合并所有页面
  const allPages = [...staticPages, ...postUrls];

  // 生成 XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};

