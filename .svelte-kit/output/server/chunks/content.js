import { n as getSql } from "./db.js";
//#region frontend/lib/server/content.ts
/** Mirrors the "Public read active venues…" RLS policy. */
var VENUE_READ_GATES = "venues.status = 'active' and venues.last_verified_at is not null and venues.last_verified_at > now() - interval '90 days' and venues.completeness_score >= 50";
/** Mirrors the "Public read published guides" RLS policy. */
var GUIDE_READ_GATES = "guides.is_published = true";
var MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
function toDate(value) {
	if (value == null) return null;
	return value instanceof Date ? value : new Date(value);
}
/** `YYYY-MM-DD` (UTC) — the directory's "verified" chip. */
function isoDay(value) {
	const date = toDate(value);
	return date ? date.toISOString().slice(0, 10) : "";
}
/** e.g. "12 October 2026" — the guide byline. */
function longDate(value) {
	const date = toDate(value);
	if (!date) return "";
	return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
function readingMinutes(mdx) {
	const words = mdx.replace(/^#+\s*/gm, "").split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}
/** MDX body -> sections split on `## ` headings; blank lines break paragraphs. */
function parseGuideSections(mdx) {
	const sections = [];
	let current = null;
	let buffer = [];
	const flush = () => {
		if (current && buffer.length) current.body.push(buffer.join(" "));
		buffer = [];
	};
	for (const raw of mdx.split("\n")) {
		const line = raw.trim();
		if (line.startsWith("## ")) {
			flush();
			current = {
				heading: line.slice(3).trim(),
				body: []
			};
			sections.push(current);
		} else if (line === "") flush();
		else if (current) buffer.push(line);
	}
	flush();
	return sections;
}
function photoKind(url) {
	if (!url) return "none";
	if (url.includes("cowork")) return "cowork";
	if (url.includes("riverside")) return "riverside";
	return "none";
}
function toVenue(row) {
	return {
		slug: row.slug,
		name: row.name,
		category: row.category,
		locationName: row.location_name ?? "Phnom Penh",
		wifiMbps: row.verified_wifi_mbps,
		hasGenerator: row.has_generator ?? false,
		priceTier: row.price_tier ?? 1,
		verifiedOn: isoDay(row.last_verified_at),
		completeness: row.completeness_score ?? 0,
		blurb: row.description_mdx ?? "",
		photo: photoKind(row.primary_photo_url)
	};
}
function toGuide(row) {
	return {
		slug: row.slug,
		pillar: row.pillar,
		title: row.title,
		dek: row.meta_description ?? "",
		author: row.author_name ?? "Editorial desk",
		reviewed: longDate(row.last_reviewed_at),
		minutes: readingMinutes(row.mdx_content),
		sections: parseGuideSections(row.mdx_content)
	};
}
/** Directory listings: active venues that pass every gate, most complete first. */
async function getDirectoryVenues(filters = {}) {
	const sql = await getSql();
	const params = [];
	const where = [VENUE_READ_GATES];
	if (filters.category && filters.category !== "all") {
		params.push(filters.category);
		where.push(`venues.category = $${params.length}`);
	}
	if (filters.generator) where.push("venues.has_generator = true");
	return (await sql.query(`select venues.slug, venues.name, venues.category, venues.verified_wifi_mbps,
		        venues.has_generator, venues.price_tier, venues.description_mdx,
		        venues.primary_photo_url, venues.completeness_score, venues.last_verified_at,
		        locations.name as location_name
		   from venues
		   left join locations on locations.id = venues.location_id
		  where ${where.join(" and ")}
		  order by venues.completeness_score desc, venues.name asc`, params)).map(toVenue);
}
/** Published guides for one pillar, newest review first. */
async function getPillarGuides(pillar, limit) {
	const sql = await getSql();
	const params = [pillar];
	let limitClause = "";
	if (limit && limit > 0) {
		params.push(limit);
		limitClause = ` limit $${params.length}`;
	}
	return (await sql.query(`select guides.slug, guides.pillar, guides.title, guides.mdx_content, guides.meta_description,
		        guides.last_reviewed_at, authors.name as author_name
		   from guides
		   left join authors on authors.id = guides.author_id
		  where ${GUIDE_READ_GATES} and guides.pillar = $1
		  order by guides.last_reviewed_at desc${limitClause}`, params)).map(toGuide);
}
/** One published guide for a pillar + slug (the spoke), or null. */
async function getGuide(pillar, slug) {
	const rows = await (await getSql()).query(`select guides.slug, guides.pillar, guides.title, guides.mdx_content, guides.meta_description,
		        guides.last_reviewed_at, authors.name as author_name
		   from guides
		   left join authors on authors.id = guides.author_id
		  where ${GUIDE_READ_GATES} and guides.pillar = $1 and guides.slug = $2
		  limit 1`, [pillar, slug]);
	return rows.length ? toGuide(rows[0]) : null;
}
/** Sangkats with rent/power notes, most walkable first. */
async function getLocations() {
	return (await (await getSql()).query(`select slug, name, parent_region, vibe_tags, rent_range_1br, walkability_score, summary_mdx
		   from locations
		  where level = 'sangkat'
		  order by walkability_score desc nulls last, name asc`)).map((row) => ({
		slug: row.slug,
		name: row.name,
		parentRegion: row.parent_region,
		vibe: (row.vibe_tags ?? []).join(" · "),
		rent1br: row.rent_range_1br == null ? null : Number(row.rent_range_1br),
		walkability: row.walkability_score,
		summary: row.summary_mdx ?? ""
	}));
}
/** The active conversion module for a placement, if one is in its date window. */
async function getActiveCta(placementTag) {
	const rows = await (await getSql()).query(`select placement_tag, offer_type, headline, description, button_text,
		        destination_url, analytics_event_name
		   from cta_modules
		  where is_active = true
		    and placement_tag = $1
		    and (start_date is null or start_date <= now())
		    and (end_date is null or end_date >= now())
		  order by priority desc, weight desc
		  limit 1`, [placementTag]);
	if (!rows.length) return null;
	const row = rows[0];
	return {
		placementTag: row.placement_tag,
		offerType: row.offer_type,
		headline: row.headline,
		description: row.description,
		buttonText: row.button_text,
		destinationUrl: row.destination_url,
		analyticsEventName: row.analytics_event_name
	};
}
/** Counts for the home hero, computed from the same gated rows the lists use. */
async function getHomeStats() {
	const row = (await (await getSql()).query(`select
		   (select count(*) from locations where level = 'sangkat')::int as sangkats,
		   (select count(*) from venues where ${VENUE_READ_GATES})::int as venues,
		   (select count(*) from guides where ${GUIDE_READ_GATES})::int as guides`))[0];
	return {
		sangkats: Number(row?.sangkats ?? 0),
		venues: Number(row?.venues ?? 0),
		guides: Number(row?.guides ?? 0)
	};
}
//#endregion
export { getLocations as a, getHomeStats as i, getDirectoryVenues as n, getPillarGuides as o, getGuide as r, getActiveCta as t };
