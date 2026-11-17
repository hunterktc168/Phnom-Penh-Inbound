import { o as getPillarGuides } from "../../../chunks/content.js";
//#region frontend/routes/visit/+page.server.ts
var load = async () => {
	return { guides: await getPillarGuides("visit") };
};
//#endregion
export { load };
