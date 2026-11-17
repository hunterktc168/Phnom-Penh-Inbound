// Client-side analytics helper: posts to `/api/track` with a stable per-device
// session id (the endpoint and the DB both cap it at 64 bytes).
import { browser } from '$app/environment';

const SESSION_KEY = 'inbound.session_id';

function sessionId(): string {
	if (!browser) return '';
	let id = localStorage.getItem(SESSION_KEY);
	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem(SESSION_KEY, id);
	}
	return id;
}

export type TrackEvent = {
	eventName: string;
	placementTag?: string;
	ctaId?: string;
	metadata?: Record<string, unknown>;
};

export function track(event: TrackEvent): void {
	if (!browser) return;
	void fetch('/api/track', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ ...event, sessionId: sessionId() }),
		keepalive: true
	}).catch(() => undefined);
}
