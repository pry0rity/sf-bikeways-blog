// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://sf-bikeways-blog.vercel.app',
  output: 'static',
  integrations: [
    tailwind(), 
    mdx(), 
    sitemap(),
    sentry({
      dsn: "https://4f58a81083674ee22bbdae75891b0667@o4508695687725056.ingest.us.sentry.io/4509289396764672",
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 1.0,
      debug: true,
      sourceMapsUploadOptions: {
        project: "javascript-astro",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    })
  ],
  vite: {
    server: {
      headers: {
        'Content-Security-Policy': `
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sentry.io;
          connect-src 'self' https://*.sentry.io;
          img-src 'self' data: https://*.sentry.io;
          style-src 'self' 'unsafe-inline';
          frame-src 'self' https://open.spotify.com;
        `.replace(/\s+/g, ' ').trim()
      }
    }
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }]
    ]
  },
});