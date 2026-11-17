// Global app types.
//
// `App.Locals` carries the per-request auth surface. The production project
// builds this from the official Supabase SSR client and defines
// `safeGetSession()` around `supabase.auth.getUser()` (never `getSession()`
// alone). This workspace ships no Supabase project and sign-in is off, so the
// same surface resolves to an anonymous session while the database-backed
// content still renders — see `hooks.server.ts`.
declare global {
	namespace App {
		interface Session {
			access_token: string;
			user: User;
		}
		interface User {
			id: string;
			email: string | null;
		}
		interface Locals {
			/** Prefers `getUser()` over `getSession()` for security. */
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
		}
	}
}

export {};
