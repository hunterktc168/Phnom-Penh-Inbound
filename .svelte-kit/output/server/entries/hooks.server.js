import { t as ensureDbReady } from "../chunks/db.js";
//#region frontend/hooks.server.ts
var handle = async ({ event, resolve }) => {
	await ensureDbReady();
	event.locals.safeGetSession = async () => ({
		session: null,
		user: null
	});
	return resolve(event, { filterSerializedResponseHeaders: (name) => name === "content-range" || name === "x-supabase-api-version" });
};
//#endregion
export { handle };
