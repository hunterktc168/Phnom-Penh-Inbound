import { r as head, x as attr } from "../../chunks/server.js";
import { t as page } from "../../chunks/state.js";
//#region frontend/lib/Header.svelte
function Header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const path = page.url.pathname;
		function current(href) {
			if (href === "/") return path === "/" ? "page" : void 0;
			return path === href || path.startsWith(href + "/") ? "page" : void 0;
		}
		$$renderer.push(`<header class="site-header"><div class="wrap header-row"><a class="brand" href="/"><strong>Inbound</strong> <span>Phnom Penh</span></a> <nav class="nav" aria-label="Primary"><a href="/directory"${attr("aria-current", current("/directory"))}>Directory</a> <a href="/visit"${attr("aria-current", current("/visit"))}>Visit</a> <a href="/live"${attr("aria-current", current("/live"))}>Live</a></nav></div></header>`);
	});
}
//#endregion
//#region frontend/routes/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	head("6m67ad", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Inbound — Phnom Penh</title>`);
		});
		$$renderer.push(`<meta name="description" content="Verified venues and practical guides for visiting or living in Phnom Penh."/>`);
	});
	$$renderer.push(`<div class="shell">`);
	Header($$renderer, {});
	$$renderer.push(`<!----> <main>`);
	children($$renderer);
	$$renderer.push(`<!----></main> <footer class="site-footer"><div class="wrap"><p>Inbound records venues only after a verification date and a completeness check.</p> <p>Figures on this preview are sample records shaped like the production directory. They are not a live feed.</p></div></footer></div>`);
}
//#endregion
export { _layout as default };
