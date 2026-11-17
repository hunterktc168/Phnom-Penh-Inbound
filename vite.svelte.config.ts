import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { grokPwaPlugin } from './scripts/grok-pwa-plugin.mjs';

export default defineConfig({
	// grokPwaPlugin() injects the platform PWA/branding head tags (and the
	// "Created with Grok" pill) into app documents in dev, preview and build.
	plugins: [grokPwaPlugin(), sveltekit()],
	server: {
		host: '0.0.0.0',
		port: 8080,
		strictPort: true
	},
	preview: {
		host: '127.0.0.1',
		port: 8081,
		strictPort: true
	}
});
