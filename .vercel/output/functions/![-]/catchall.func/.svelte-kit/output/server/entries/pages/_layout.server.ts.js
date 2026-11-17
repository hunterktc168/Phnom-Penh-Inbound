//#region frontend/routes/+layout.server.ts
var load = async ({ locals: { safeGetSession }, depends }) => {
	depends("supabase:auth");
	const { session, user } = await safeGetSession();
	return {
		session,
		user
	};
};
//#endregion
export { load };
