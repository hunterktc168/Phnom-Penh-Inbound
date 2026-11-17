import { S as escape_html, a as stringify, n as ensure_array_like, t as attr_class, x as attr } from "../../chunks/server.js";
//#region frontend/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		$$renderer.push(`<div class="wrap hero"><div class="hero-copy"><p class="kicker">Cambodia inbound</p> <h1>A city you can actually plan around.</h1> <p class="lede">Neighbourhood notes, a venue directory that refuses stale listings, and short guides for a visit or a lease.</p> <div class="hero-actions"><a class="btn btn-primary" href="/directory">Browse the directory</a> <a class="btn btn-ghost" href="/live">Read for living here</a></div> <div class="stat-row"><div class="stat"><b>${escape_html(data.stats.sangkats)}</b><span>Sangkats with rent notes</span></div> <div class="stat"><b>90</b><span>Days before a venue goes stale</span></div> <div class="stat"><b>5</b><span>Venue categories</span></div> <div class="stat"><b>${escape_html(data.stats.venues)}</b><span>Active listings right now</span></div></div></div> <figure class="hero-photo"><img src="/riverside.jpg" alt="Late afternoon along a tree-lined Phnom Penh quay"/> <figcaption>Daun Penh, late afternoon. The river is orientation, not the whole city.</figcaption></figure></div> <section class="section"><div class="wrap"><div class="section-head"><h2>Where people actually stay</h2></div> <div class="grid-2"><!--[-->`);
		const each_array = ensure_array_like(data.locations);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let location = each_array[$$index];
			$$renderer.push(`<article class="card"><div class="mark"></div> <div class="card-body"><p class="meta">${escape_html(location.parentRegion)}</p> <h3>${escape_html(location.name)}</h3> <p>${escape_html(location.summary)}</p> `);
			if (location.rent1br !== null || location.walkability !== null) {
				$$renderer.push("<!--[-->");
				$$renderer.push(`<p class="meta">`);
				if (location.rent1br !== null) {
					$$renderer.push("<!--[-->");
					$$renderer.push(`1-bed about $${escape_html(location.rent1br)}/mo`);
				} else $$renderer.push("<!--[!-->");
				$$renderer.push(`<!--]-->`);
				if (location.rent1br !== null && location.walkability !== null) {
					$$renderer.push("<!--[-->");
					$$renderer.push(`·`);
				} else $$renderer.push("<!--[!-->");
				$$renderer.push(`<!--]-->`);
				if (location.walkability !== null) {
					$$renderer.push("<!--[-->");
					$$renderer.push(`walkability ${escape_html(location.walkability)}`);
				} else $$renderer.push("<!--[!-->");
				$$renderer.push(`<!--]--></p>`);
			} else $$renderer.push("<!--[!-->");
			$$renderer.push(`<!--]--></div></article>`);
		}
		$$renderer.push(`<!--]--></div></div></section> <section class="section" style="padding-top: 0;"><div class="wrap"><div class="section-head"><h2>From the desk</h2> <a href="/visit">All guides</a></div> <div class="grid-3"><!--[-->`);
		const each_array_1 = ensure_array_like(data.featured);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let guide = each_array_1[$$index_1];
			$$renderer.push(`<a class="card"${attr("href", `/${stringify(guide.pillar)}/${stringify(guide.slug)}`)}><div${attr_class("mark", void 0, { "clay": guide.pillar === "visit" })}></div> <div class="card-body"><p class="meta">${escape_html(guide.pillar === "live" ? "Live" : "Visit")} · ${escape_html(guide.minutes)} min</p> <h3>${escape_html(guide.title)}</h3> <p class="meta">${escape_html(guide.dek)}</p></div></a>`);
		}
		$$renderer.push(`<!--]--></div></div></section>`);
	});
}
//#endregion
export { _page as default };
