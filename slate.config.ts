/*
 * @file Theme configuration
 */
import { defineConfig } from './src/helpers/config-helper';

export default defineConfig({
  lang: 'en-US',
  site: 'https://aivibe.vercel.app',
  avatar: '/avatar.png',
  title: 'Ai Vibe',
  description: 'vibe productivity',
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
