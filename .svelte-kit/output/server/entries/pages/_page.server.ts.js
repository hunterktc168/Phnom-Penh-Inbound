import { a as getLocations, i as getHomeStats, o as getPillarGuides } from "../../chunks/content.js";
//#region frontend/routes/+page.server.ts
var load = async () => {
	const [locations, live, visit, stats] = await Promise.all([
		getLocations(),
		getPillarGuides("live"),
		getPillarGuides("visit"),
		getHomeStats()
	]);
	return {
		locations,
		featured: [...live, ...visit].slice(0, 3),
		stats
	};
};
//#endregion
export { load };
