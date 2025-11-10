import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '0.0.0.0',
		port: 5173,
		strictPort: false,
		allowedHosts: ['.doptig.cloud', '.gitpod.io'],
		headers: {
			'Content-Security-Policy': `
				default-src 'self';
				script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sentry.io https://unpkg.com https://api.mapbox.com;
				connect-src 'self' https://*.sentry.io https://*.tile.openstreetmap.org;
				img-src 'self' data: https://*.sentry.io https://*.tile.openstreetmap.org https://unpkg.com https://covers.openlibrary.org;
				style-src 'self' 'unsafe-inline' https://unpkg.com https://api.fontshare.com;
				frame-src 'self' https://open.spotify.com;
				worker-src 'self' blob:;
			`.replace(/\s+/g, ' ').trim()
		}
	}
});
