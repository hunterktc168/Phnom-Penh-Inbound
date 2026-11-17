// Secure analytics ingestion.
//
// Validates the event against the closed set the database CHECK constraint
// enforces, plus the UUID / session-length / metadata-shape rules, then inserts
// as the table owner (the RLS policy grants anonymous INSERT). SvelteKit HTTP
// errors are re-thrown rather than swallowed so a 400/500 keeps its status.
import { error, isHttpError, json } from '@sveltejs/kit';
import { getSql } from '$lib/server/db';
import type { RequestHandler } from './$types';

const VALID_EVENT_NAMES = new Set([
	'tool_started',
	'tool_completed',
	'export_requested',
	'email_submitted',
	'cta_click',
	'cta_impression',
	'directory_filter_used',
	'map_opened'
]);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const POST: RequestHandler = async ({ request }) => {
	try {
		let body: unknown;
		try {
			body = await request.json();
		} catch {
			throw error(400, 'Invalid JSON');
		}

		if (!body || typeof body !== 'object' || Array.isArray(body)) {
			throw error(400, 'Invalid payload');
		}

		const { eventName, placementTag, ctaId, sessionId, metadata } = body as Record<string, unknown>;

		if (typeof eventName !== 'string' || !VALID_EVENT_NAMES.has(eventName)) {
			throw error(400, 'Invalid eventName');
		}

		if (placementTag !== undefined && placementTag !== null && typeof placementTag !== 'string') {
			throw error(400, 'Invalid placementTag');
		}

		if (ctaId !== undefined && ctaId !== null && (typeof ctaId !== 'string' || !UUID_RE.test(ctaId))) {
			throw error(400, 'Invalid ctaId');
		}

		if (sessionId !== undefined && sessionId !== null) {
			if (typeof sessionId !== 'string' || new TextEncoder().encode(sessionId).length > 64) {
				throw error(400, 'Invalid sessionId');
			}
		}

		if (metadata !== undefined && metadata !== null) {
			if (typeof metadata !== 'object' || Array.isArray(metadata)) {
				throw error(400, 'Invalid metadata');
			}
		}

		const sql = await getSql();
		try {
			await sql.query(
				`insert into analytics_events (event_name, placement_tag, cta_id, session_id, metadata)
				 values ($1, $2, $3, $4, $5::jsonb)`,
				[
					eventName,
					(placementTag as string | null | undefined) ?? null,
					(ctaId as string | null | undefined) ?? null,
					(sessionId as string | null | undefined) ?? null,
					JSON.stringify((metadata as Record<string, unknown> | null | undefined) ?? {})
				]
			);
		} catch (dbError) {
			console.error('Analytics insert error:', dbError);
			throw error(500, 'Failed to record event');
		}

		return json({ success: true });
	} catch (err) {
		if (isHttpError(err)) throw err;
		throw error(400, 'Invalid request payload');
	}
};
