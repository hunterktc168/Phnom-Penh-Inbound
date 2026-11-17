import { S as escape_html } from "../../chunks/server.js";
import { t as page } from "../../chunks/state.js";
//#region frontend/routes/+error.svelte
function _error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="wrap page-title" style="padding-bottom: 64px;"><p class="kicker">Missing</p> <h1>${escape_html(page.status)}</h1> <p class="lede">${escape_html(page.error?.message ?? "That page is not in the directory.")}</p> <p style="margin-top: 18px;"><a class="btn btn-primary" href="/">Back to the front</a></p></div>`);
	});
}
//#endregion
export { _error as default };
