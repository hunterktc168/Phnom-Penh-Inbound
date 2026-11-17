// Server-side content queries for the Cambodia Inbound content engine.
//
// The database enforces the business rules with RLS policies, trigger-derived
// completeness scores, and CHECK constraints (see `migrations/0002_*.sql`).
// This app connects as the table owner, which BYPASSES row-level security, so
// the same public read gates are re-stated here in SQL — a published/active/
// high-quality row is the only thing a query can return.
import { getSql } from '$lib/server/db';
import type { Cta, Guide, Location, Pillar, Venue, VenueCategory } from '$lib/data';

/** Mirrors the "Public read active venues…" RLS policy. */
const VENUE_READ_GATES =
	"venues.status = 'active' and venues.last_verified_at is not null " +
	"and venues.last_verified_at > now() - interval '90 days' and venues.completeness_score >= 50";
/** Mirrors the "Public read published guides" RLS policy. */
const GUIDE_READ_GATES = 'guides.is_published = true';

type VenueRow = {
	slug: string;
	name: string;
	category: VenueCategory;
	verified_wifi_mbps: number | null;
	has_generator: boolean | null;
	price_tier: number | null;
	description_mdx: string | null;
	primary_photo_url: string | null;
	completeness_score: number | null;
	last_verified_at: Date | string | null;
	location_name: string | null;
};

type GuideRow = {
	slug: string;
	pillar: Pillar;
	title: string;
	mdx_content: string;
	meta_description: string | null;
	last_reviewed_at: Date | string;
	author_name: string | null;
};

type LocationRow = {
	slug: string;
	name: string;
	parent_region: string;
	vibe_tags: string[] | null;
	rent_range_1br: string | number | null;
	walkability_score: number | null;
	summary_mdx: string | null;
};

type CtaRow = {
	placement_tag: string;
	offer_type: Cta['offerType'];
	headline: string;
	description: string | null;
	button_text: string;
	destination_url: string;
	analytics_event_name: string;
};

const MONTHS = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

function toDate(value: Date | string | null): Date | null {
	if (value == null) return null;
	return value instanceof Date ? value : new Date(value);
}

/** `YYYY-MM-DD` (UTC) — the directory's "verified" chip. */
function isoDay(value: Date | string | null): string {
	const date = toDate(value);
	return date ? date.toISOString().slice(0, 10) : '';
}

/** e.g. "12 October 2026" — the guide byline. */
function longDate(value: Date | string | null): string {
	const date = toDate(value);
	if (!date) return '';
	return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function readingMinutes(mdx: string): number {
	const words = mdx.replace(/^#+\s*/gm, '').split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}

/** MDX body -> sections split on `## ` headings; blank lines break paragraphs. */
function parseGuideSections(mdx: string): Guide['sections'] {
	const sections: Guide['sections'] = [];
	let current: { heading: string; body: string[] } | null = null;
	let buffer: string[] = [];
	const flush = () => {
		if (current && buffer.length) current.body.push(buffer.join(' '));
		buffer = [];
	};
	for (const raw of mdx.split('\n')) {
		const line = raw.trim();
		if (line.startsWith('## ')) {
			flush();
			current = { heading: line.slice(3).trim(), body: [] };
			sections.push(current);
		} else if (line === '') {
			flush();
		} else if (current) {
			buffer.push(line);
		}
	}
	flush();
	return sections;
}

function photoKind(url: string | null): Venue['photo'] {
	if (!url) return 'none';
	if (url.includes('cowork')) return 'cowork';
	if (url.includes('riverside')) return 'riverside';
	return 'none';
}

function toVenue(row: VenueRow): Venue {
	return {
		slug: row.slug,
		name: row.name,
		category: row.category,
		locationName: row.location_name ?? 'Phnom Penh',
		wifiMbps: row.verified_wifi_mbps,
		hasGenerator: row.has_generator ?? false,
		priceTier: (row.price_tier ?? 1) as Venue['priceTier'],
		verifiedOn: isoDay(row.last_verified_at),
		completeness: row.completeness_score ?? 0,
		blurb: row.description_mdx ?? '',
		photo: photoKind(row.primary_photo_url)
	};
}

function toGuide(row: GuideRow): Guide {
	return {
		slug: row.slug,
		pillar: row.pillar,
		title: row.title,
		dek: row.meta_description ?? '',
		author: row.author_name ?? 'Editorial desk',
		reviewed: longDate(row.last_reviewed_at),
		minutes: readingMinutes(row.mdx_content),
		sections: parseGuideSections(row.mdx_content)
	};
}

/** Directory listings: active venues that pass every gate, most complete first. */
export async function getDirectoryVenues(
	filters: { category?: string | null; generator?: boolean } = {}
): Promise<Venue[]> {
	const sql = await getSql();
	const params: unknown[] = [];
	const where: string[] = [VENUE_READ_GATES];

	if (filters.category && filters.category !== 'all') {
		params.push(filters.category);
		where.push(`venues.category = $${params.length}`);
	}
	if (filters.generator) {
		where.push('venues.has_generator = true');
	}

	const rows = await sql.query<VenueRow>(
		`select venues.slug, venues.name, venues.category, venues.verified_wifi_mbps,
		        venues.has_generator, venues.price_tier, venues.description_mdx,
		        venues.primary_photo_url, venues.completeness_score, venues.last_verified_at,
		        locations.name as location_name
		   from venues
		   left join locations on locations.id = venues.location_id
		  where ${where.join(' and ')}
		  order by venues.completeness_score desc, venues.name asc`,
		params
	);
	return rows.map(toVenue);
}

/** Published guides for one pillar, newest review first. */
export async function getPillarGuides(pillar: Pillar, limit?: number): Promise<Guide[]> {
	const sql = await getSql();
	const params: unknown[] = [pillar];
	let limitClause = '';
	if (limit && limit > 0) {
		params.push(limit);
		limitClause = ` limit $${params.length}`;
	}
	const rows = await sql.query<GuideRow>(
		`select guides.slug, guides.pillar, guides.title, guides.mdx_content, guides.meta_description,
		        guides.last_reviewed_at, authors.name as author_name
		   from guides
		   left join authors on authors.id = guides.author_id
		  where ${GUIDE_READ_GATES} and guides.pillar = $1
		  order by guides.last_reviewed_at desc${limitClause}`,
		params
	);
	return rows.map(toGuide);
}

/** One published guide for a pillar + slug (the spoke), or null. */
export async function getGuide(pillar: Pillar, slug: string): Promise<Guide | null> {
	const sql = await getSql();
	const rows = await sql.query<GuideRow>(
		`select guides.slug, guides.pillar, guides.title, guides.mdx_content, guides.meta_description,
		        guides.last_reviewed_at, authors.name as author_name
		   from guides
		   left join authors on authors.id = guides.author_id
		  where ${GUIDE_READ_GATES} and guides.pillar = $1 and guides.slug = $2
		  limit 1`,
		[pillar, slug]
	);
	return rows.length ? toGuide(rows[0]) : null;
}

/** Sangkats with rent/power notes, most walkable first. */
export async function getLocations(): Promise<Location[]> {
	const sql = await getSql();
	const rows = await sql.query<LocationRow>(
		`select slug, name, parent_region, vibe_tags, rent_range_1br, walkability_score, summary_mdx
		   from locations
		  where level = 'sangkat'
		  order by walkability_score desc nulls last, name asc`
	);
	return rows.map((row) => ({
		slug: row.slug,
		name: row.name,
		parentRegion: row.parent_region,
		vibe: (row.vibe_tags ?? []).join(' · '),
		rent1br: row.rent_range_1br == null ? null : Number(row.rent_range_1br),
		walkability: row.walkability_score,
		summary: row.summary_mdx ?? ''
	}));
}

/** The active conversion module for a placement, if one is in its date window. */
export async function getActiveCta(placementTag: string): Promise<Cta | null> {
	const sql = await getSql();
	const rows = await sql.query<CtaRow>(
		`select placement_tag, offer_type, headline, description, button_text,
		        destination_url, analytics_event_name
		   from cta_modules
		  where is_active = true
		    and placement_tag = $1
		    and (start_date is null or start_date <= now())
		    and (end_date is null or end_date >= now())
		  order by priority desc, weight desc
		  limit 1`,
		[placementTag]
	);
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
export async function getHomeStats(): Promise<{ sangkats: number; venues: number; guides: number }> {
	const sql = await getSql();
	const rows = await sql.query<{ sangkats: number; venues: number; guides: number }>(
		`select
		   (select count(*) from locations where level = 'sangkat')::int as sangkats,
		   (select count(*) from venues where ${VENUE_READ_GATES})::int as venues,
		   (select count(*) from guides where ${GUIDE_READ_GATES})::int as guides`
	);
	const row = rows[0];
	return {
		sangkats: Number(row?.sangkats ?? 0),
		venues: Number(row?.venues ?? 0),
		guides: Number(row?.guides ?? 0)
	};
}
