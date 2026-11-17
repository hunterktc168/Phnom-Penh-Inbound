import { S as escape_html, a as stringify, n as ensure_array_like, r as head, x as attr } from "../../../chunks/server.js";
//#region frontend/routes/live/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("13b9tff", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Live — Inbound</title>`);
			});
		});
		$$renderer.push(`<div class="wrap page-title"><p class="kicker">Live</p> <h1>Notes for a lease, not a weekend.</h1> <p class="lede">Rent, power, and the paperwork that should happen before you feel settled. Reviewed on a six-month clock.</p></div> <section class="section"><div class="wrap grid-2"><!--[-->`);
		const each_array = ensure_array_like(data.guides);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let guide = each_array[$$index];
			$$renderer.push(`<a class="card"${attr("href", `/live/${stringify(guide.slug)}`)}><div class="mark"></div> <div class="card-body"><p class="meta">${escape_html(guide.minutes)} min · reviewed ${escape_html(guide.reviewed)}</p> <h3>${escape_html(guide.title)}</h3> <p>${escape_html(guide.dek)}</p></div></a>`);
		}
		$$renderer.push(`<!--]--></div></section>`);
	});
}
//#endregion
export { _page as default };
