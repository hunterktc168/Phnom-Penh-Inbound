import type { LayoutServerLoad } from './$types';

// The root layout load depends on the `supabase:auth` key so `invalidate('supabase:auth')`
// re-runs it after a sign-in or sign-out — the pattern the Supabase SvelteKit
// tutorial uses. Session/user surface to every page through `App.PageData`.
export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, depends }) => {
	depends('supabase:auth');
	const { session, user } = await safeGetSession();
	return { session, user };
};
