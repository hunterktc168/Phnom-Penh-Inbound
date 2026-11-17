// Server-rendered output for Vercel: pages read the database through server
// loads and `/api/track` is a POST endpoint, neither of which a static adapter
// can produce. (The workspace deploys to Vercel; `vercel.json` pins the install.)
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Pin the Vercel function runtime: the sandbox builds on a Node version
		// (v24) newer than the adapter allows locally, so state it explicitly.
		adapter: adapter({ runtime: 'nodejs22.x' }),
		files: {
			assets: 'frontend/static',
			hooks: {
				client: 'frontend/hooks.client',
				server: 'frontend/hooks.server',
				universal: 'frontend/hooks'
			},
			lib: 'frontend/lib',
			params: 'frontend/params',
			routes: 'frontend/routes',
			serviceWorker: 'frontend/service-worker',
			appTemplate: 'frontend/app.html',
			errorTemplate: 'frontend/error.html'
		},
		prerender: {
			handleMissingId: 'warn',
			handleHttpError: 'warn'
		}
	}
};

export default config;
