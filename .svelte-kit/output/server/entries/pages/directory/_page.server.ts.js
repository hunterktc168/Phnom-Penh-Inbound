import { n as getDirectoryVenues, t as getActiveCta } from "../../../chunks/content.js";
//#region frontend/routes/directory/+page.server.ts
var load = async ({ url }) => {
	const category = url.searchParams.get("category");
	const generator = url.searchParams.get("generator") === "true";
	const [venues, cta] = await Promise.all([getDirectoryVenues({
		category,
		generator
	}), getActiveCta("directory_sidebar")]);
	return {
		venues,
		cta,
		filters: {
			category: category ?? "all",
			generator
		}
	};
};
//#endregion
export { load };
