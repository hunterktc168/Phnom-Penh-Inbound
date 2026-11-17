import * as server from '../entries/pages/live/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/live/_page.svelte.js')).default;
export { server };
export const server_id = "frontend/routes/live/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.CGPnEHkv.js","_app/immutable/chunks/CMssfgCF.js","_app/immutable/chunks/xihTtKlq.js"];
export const stylesheets = [];
export const fonts = [];
