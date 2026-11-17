import { S as escape_html, a as stringify, n as ensure_array_like, x as attr } from "./server.js";
import { t as CtaBlock } from "./CtaBlock.js";
//#region frontend/lib/GuideArticle.svelte
function GuideArticle($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { guide, pillarLabel, cta = null } = $$props;
		$$renderer.push(`<article class="article"><a class="back"${attr("href", `/${stringify(guide.pillar)}`)}>← ${escape_html(pillarLabel)}</a> <p class="kicker">${escape_html(pillarLabel)}</p> <h1>${escape_html(guide.title)}</h1> <p class="dek">${escape_html(guide.dek)}</p> <p class="byline">${escape_html(guide.author)} · reviewed ${escape_html(guide.reviewed)} · ${escape_html(guide.minutes)} min</p> <!--[-->`);
		const each_array = ensure_array_like(guide.sections);
		for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
			let section = each_array[$$index_1];
			$$renderer.push(`<section><h2>${escape_html(section.heading)}</h2> <!--[-->`);
			const each_array_1 = ensure_array_like(section.body);
			for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
				let paragraph = each_array_1[$$index];
				$$renderer.push(`<p>${escape_html(paragraph)}</p>`);
			}
			$$renderer.push(`<!--]--></section>`);
		}
		$$renderer.push(`<!--]--> `);
		if (cta) {
			$$renderer.push("<!--[-->");
			CtaBlock($$renderer, { cta });
		} else $$renderer.push("<!--[!-->");
		$$renderer.push(`<!--]--></article>`);
	});
}
//#endregion
export { GuideArticle as t };
