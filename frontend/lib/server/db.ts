// Server-only database access for the SvelteKit app.
//
// The workspace has a single schema source (`migrations/*.sql`, auto-applied)
// and a single client (`src/lib/db.ts`): embedded PGLite in the live preview,
// Neon/Postgres in production — chosen by whether `DATABASE_URL` is set.
//
// Re-exported under `$lib/server/` so SvelteKit refuses to bundle it into
// client code: importing any `$lib/server/*` module from a component is a
// build-time error, which keeps the DB out of the browser.
export { getSql, ensureDbReady, dbSource } from '../../../src/lib/db';
export type { Sql, DbSource } from '../../../src/lib/db';
