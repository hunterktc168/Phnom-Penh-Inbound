import { ensureDbReady } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

// Request hook.
//
// In the production project this is where the cookie-aware Supabase SSR client
// is created (`createServerClient(...)` with `event.cookies.getAll/setAll`) and
// `locals.safeGetSession` is built from `supabase.auth.getUser()`. This
// workspace has no Supabase project configured and sign-in is off, so the same
// Locals contract is satisfied with an anonymous session, and the database is
// bootstrapped (migrations applied) before the first request is handled.
export const handle: Handle = async ({ event, resolve }) => {
	await ensureDbReady();
	event.locals.safeGetSession = async () => ({ session: null, user: null });

	return resolve(event, {
		filterSerializedResponseHeaders: (name) =>
			name === 'content-range' || name === 'x-supabase-api-version'
	});
};
