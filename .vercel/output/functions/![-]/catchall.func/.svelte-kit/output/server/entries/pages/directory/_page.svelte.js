import { S as escape_html, n as ensure_array_like, r as head, x as attr } from "../../../chunks/server.js";
import { t as CtaBlock } from "../../../chunks/CtaBlock.js";
//#region frontend/lib/data.ts
var CATEGORIES = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "coworking",
		label: "Coworking"
	},
	{
		id: "cafe",
		label: "Cafés"
	},
	{
		id: "clinic",
		label: "Clinics"
	},
	{
		id: "apartment",
		label: "Apartments"
	},
	{
		id: "visa_agent",
		label: "Visa agents"
	}
];
function categoryLabel(category) {
	return CATEGORIES.find((item) => item.id === category)?.label ?? category;
}
function tierLabel(tier) {
	return "$".repeat(tier);
}
//#endregion
//#region frontend/routes/directory/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		function hrefFor(nextCategory, nextGenerator) {
			const params = new URLSearchParams();
			if (nextCategory !== "all") params.set("category", nextCategory);
			if (nextGenerator) params.set("generator", "true");
			const query = params.toString();
			return query ? `/directory?${query}` : "/directory";
		}
		function photo(kind) {
			if (kind === "riverside") return "/riverside.jpg";
			if (kind === "cowork") return "/cowork.jpg";
			return null;
		}
		head("1ep5ila", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Directory — Inbound</title>`);
			});
		});
		$$renderer.push(`<div class="wrap page-title"><p class="kicker">Directory</p> <h1>Places that were checked, not scraped.</h1> <p class="lede">Active listings only: a verification date inside ninety days, and enough detail to be useful. Filter by what you actually need this week.</p> <div class="filters" role="group" aria-label="Category"><!--[-->`);
		const each_array = ensure_array_like(CATEGORIES);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			$$renderer.push(`<a class="chip"${attr("href", hrefFor(item.id, data.filters.generator))}${attr("aria-current", data.filters.category === item.id ? "true" : void 0)}>${escape_html(item.label)}</a>`);
		}
		$$renderer.push(`<!--]--> <a class="chip"${attr("href", hrefFor(data.filters.category, !data.filters.generator))}${attr("aria-current", data.filters.generator ? "true" : void 0)}>Generator</a></div></div> <div class="wrap" style="padding-bottom: 56px;">`);
		if (data.venues.length === 0) {
			$$renderer.push("<!--[-->");
			$$renderer.push(`<p class="empty">Nothing in this cut of the directory. Clear the generator filter or choose another category.</p>`);
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push(`<div class="venue-list"><!--[-->`);
			const each_array_1 = ensure_array_like(data.venues);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let venue = each_array_1[$$index_1];
				$$renderer.push(`<article class="venue"><div class="venue-photo">`);
				if (photo(venue.photo)) {
					$$renderer.push("<!--[-->");
					$$renderer.push(`<img${attr("src", photo(venue.photo))} alt=""/>`);
				} else $$renderer.push("<!--[!-->");
				$$renderer.push(`<!--]--></div> <div class="venue-main"><div class="venue-top"><div><p class="pill">${escape_html(categoryLabel(venue.category))}</p> <h2 style="font-size: 28px; margin-top: 4px;">${escape_html(venue.name)}</h2></div> <p class="meta">${escape_html(tierLabel(venue.priceTier))}</p></div> <p style="margin-top: 8px;">${escape_html(venue.blurb)}</p> <div class="facts"><span>${escape_html(venue.locationName)}</span> <span>${escape_html(venue.hasGenerator ? "Generator" : "No generator")}</span> `);
				if (venue.wifiMbps) {
					$$renderer.push("<!--[-->");
					$$renderer.push(`<span>${escape_html(venue.wifiMbps)} Mbps checked</span>`);
				} else $$renderer.push("<!--[!-->");
				$$renderer.push(`<!--]--> <span>Verified ${escape_html(venue.verifiedOn)}</span> <span>Completeness ${escape_html(venue.completeness)}</span></div></div></article>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> `);
		if (data.cta) {
			$$renderer.push("<!--[-->");
			CtaBlock($$renderer, { cta: data.cta });
		} else $$renderer.push("<!--[!-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
