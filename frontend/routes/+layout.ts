// Server-rendered: pages read the database through server loads and the app
// exposes a POST analytics endpoint, so there is no static prerender pass.
export const prerender = false;
export const ssr = true;
export const trailingSlash = 'never';
