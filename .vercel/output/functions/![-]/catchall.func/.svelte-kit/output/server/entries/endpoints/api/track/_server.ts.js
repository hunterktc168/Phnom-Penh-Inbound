import { n as getSql } from "../../../../chunks/db.js";
import { error, isHttpError, json } from "@sveltejs/kit";
//#region frontend/routes/api/track/+server.ts
var VALID_EVENT_NAMES = /* @__PURE__ */ new Set([
	"tool_started",
	"tool_completed",
	"export_requested",
	"email_submitted",
	"cta_click",
	"cta_impression",
	"directory_filter_used",
	"map_opened"
]);
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var POST = async ({ request }) => {
	try {
		let body;
		try {
			body = await request.json();
		} catch {
			throw error(400, "Invalid JSON");
		}
		if (!body || typeof body !== "object" || Array.isArray(body)) throw error(400, "Invalid payload");
		const { eventName, placementTag, ctaId, sessionId, metadata } = body;
		if (typeof eventName !== "string" || !VALID_EVENT_NAMES.has(eventName)) throw error(400, "Invalid eventName");
		if (placementTag !== void 0 && placementTag !== null && typeof placementTag !== "string") throw error(400, "Invalid placementTag");
		if (ctaId !== void 0 && ctaId !== null && (typeof ctaId !== "string" || !UUID_RE.test(ctaId))) throw error(400, "Invalid ctaId");
		if (sessionId !== void 0 && sessionId !== null) {
			if (typeof sessionId !== "string" || new TextEncoder().encode(sessionId).length > 64) throw error(400, "Invalid sessionId");
		}
		if (metadata !== void 0 && metadata !== null) {
			if (typeof metadata !== "object" || Array.isArray(metadata)) throw error(400, "Invalid metadata");
		}
		const sql = await getSql();
		try {
			await sql.query(`insert into analytics_events (event_name, placement_tag, cta_id, session_id, metadata)
				 values ($1, $2, $3, $4, $5::jsonb)`, [
				eventName,
				placementTag ?? null,
				ctaId ?? null,
				sessionId ?? null,
				JSON.stringify(metadata ?? {})
			]);
		} catch (dbError) {
			console.error("Analytics insert error:", dbError);
			throw error(500, "Failed to record event");
		}
		return json({ success: true });
	} catch (err) {
		if (isHttpError(err)) throw err;
		throw error(400, "Invalid request payload");
	}
};
//#endregion
export { POST };
