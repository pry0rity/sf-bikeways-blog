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
          script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sentry.io https://unpkg.com https://api.mapbox.com;
          connect-src 'self' https://*.sentry.io https://*.tile.openstreetmap.org;
          img-src 'self' data: https://*.sentry.io https://*.tile.openstreetmap.org https://unpkg.com;
          style-src 'self' 'unsafe-inline' https://unpkg.com https://api.fontshare.com;
          frame-src 'self' https://open.spotify.com;
          worker-src 'self' blob:;
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