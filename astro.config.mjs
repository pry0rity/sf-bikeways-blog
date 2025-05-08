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
        project: "pry0ritys-priorities",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    })
  ],
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