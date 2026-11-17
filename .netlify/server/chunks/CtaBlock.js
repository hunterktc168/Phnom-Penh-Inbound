import { S as escape_html, x as attr } from "./server.js";
//#region frontend/lib/CtaBlock.svelte
function CtaBlock($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { cta } = $$props;
		cta.analyticsEventName;
		$$renderer.push(`<aside class="cta"><div class="cta-copy"><h3>${escape_html(cta.headline)}</h3> `);
		if (cta.description) {
			$$renderer.push("<!--[-->");
			$$renderer.push(`<p class="meta">${escape_html(cta.description)}</p>`);
		} else $$renderer.push("<!--[!-->");
		$$renderer.push(`<!--]--></div> <a class="btn btn-primary"${attr("href", cta.destinationUrl)}>${escape_html(cta.buttonText)}</a></aside>`);
	});
}
//#endregion
export { CtaBlock as t };
