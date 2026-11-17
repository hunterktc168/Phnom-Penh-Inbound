import * as server from '../entries/pages/live/_slug_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/live/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "frontend/routes/live/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.kG8hiiEa.js","_app/immutable/chunks/CMssfgCF.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/EMfI_r2W.js","_app/immutable/chunks/FYbzlb1G.js"];
export const stylesheets = [];
export const fonts = [];
