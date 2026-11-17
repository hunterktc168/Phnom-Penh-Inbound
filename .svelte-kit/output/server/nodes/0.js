import * as universal from '../entries/pages/_layout.ts.js';
import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "frontend/routes/+layout.ts";
export { server };
export const server_id = "frontend/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.D6JqX2dV.js","_app/immutable/chunks/CMssfgCF.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DF-Aru9m.js","_app/immutable/chunks/CHEqYmoQ.js"];
export const stylesheets = ["_app/immutable/assets/0.Qrk_Wk6i.css"];
export const fonts = [];
