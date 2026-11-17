import * as server from '../entries/pages/visit/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/visit/_page.svelte.js')).default;
export { server };
export const server_id = "frontend/routes/visit/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.BYB6PZCk.js","_app/immutable/chunks/CMssfgCF.js","_app/immutable/chunks/xihTtKlq.js"];
export const stylesheets = [];
export const fonts = [];
