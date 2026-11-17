import { S as escape_html, r as head } from "../../../../chunks/server.js";
import { t as GuideArticle } from "../../../../chunks/GuideArticle.js";
//#region frontend/routes/visit/[slug]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("1ku5idc", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(data.guide.title)} — Inbound</title>`);
			});
		});
		GuideArticle($$renderer, {
			guide: data.guide,
			cta: data.cta,
			pillarLabel: "Visit"
		});
	});
}
//#endregion
export { _page as default };
