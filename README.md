## Tech Stack

- [SvelteKit](https://kit.svelte.dev)
- [Svelte 5](https://svelte.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [MDsveX](https://mdsvex.pngwn.io) for Markdown support
- [Leaflet](https://leafletjs.com) for interactive maps

## Project Structure

```
sf-bikeways-blog/
├── static/          # Static assets
├── src/
│   ├── lib/
│   │   ├── components/  # Reusable Svelte components
│   │   └── utils/       # Utility functions
│   ├── routes/          # SvelteKit routes
│   ├── content/         # Blog posts and rides (Markdown)
│   ├── app.html         # HTML template
│   └── app.css          # Global styles
├── svelte.config.js     # SvelteKit configuration
└── package.json
```

## Development

```sh
npm install
npm run dev
```

## Building

```sh
npm run build
npm run preview
```

The build output will be in the `build/` directory, ready for static hosting.

## License

MIT
