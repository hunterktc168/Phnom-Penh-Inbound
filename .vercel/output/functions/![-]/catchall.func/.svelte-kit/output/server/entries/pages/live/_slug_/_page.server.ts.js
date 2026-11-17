import { r as getGuide, t as getActiveCta } from "../../../../chunks/content.js";
import { error } from "@sveltejs/kit";
//#region frontend/routes/live/[slug]/+page.server.ts
var load = async ({ params }) => {
	const guide = await getGuide("live", params.slug);
	if (!guide) throw error(404, "Guide not found or unpublished");
	return {
		guide,
		cta: await getActiveCta("guide_spoke_footer")
	};
};
//#endregion
export { load };
