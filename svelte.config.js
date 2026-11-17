// Server-rendered output for Netlify: pages read the database through server
// loads and `/api/track` is a POST endpoint, neither of which a static adapter
// can produce. `netlify.toml` pins the publish directory (`build`) so the
// Netlify UI's stale `dist/client` setting can't win.
import adapter from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
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
