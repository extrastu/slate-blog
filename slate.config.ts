/*
 * @file Theme configuration
 */
import { defineConfig } from './src/helpers/config-helper';

export default defineConfig({
  lang: 'en-US',
  site: 'https://aivibe.vercel.app',
  avatar: '/avatar.png',
  title: 'AI Vibe - Vibe Coding & AI Tools Collection',
  description:
    'AI Vibe: Discover the best vibe coding tools, AI products, and coding resources. Explore curated collections of AI tools, developer utilities, and productivity apps for modern developers.',
  lastModified: true,
  readTime: true,
  footer: {
    copyright: '© 2025 extrastu',
  },
  socialLinks: [
    {
      icon: 'github',
      link: 'https://github.com/extrastu',
    },
  ],
});
