// View models for the Cambodia Inbound content engine.
//
// The Postgres schema in `migrations/` is the source of truth; these types
// describe the shapes the Svelte components render, and `$lib/server/content.ts`
// maps database rows onto them (applying the public read gates in SQL).

export type Pillar = 'visit' | 'live';
export type VenueCategory = 'coworking' | 'clinic' | 'apartment' | 'cafe' | 'visa_agent';

export type Location = {
	slug: string;
	name: string;
	parentRegion: string;
	vibe: string;
	rent1br: number | null;
	walkability: number | null;
	summary: string;
};

export type Venue = {
	slug: string;
	name: string;
	category: VenueCategory;
	locationName: string;
	wifiMbps: number | null;
	hasGenerator: boolean;
	priceTier: 1 | 2 | 3 | 4;
	verifiedOn: string;
	completeness: number;
	blurb: string;
	photo: 'riverside' | 'cowork' | 'none';
};

export type GuideSection = { heading: string; body: string[] };

export type Guide = {
	slug: string;
	pillar: Pillar;
	title: string;
	dek: string;
	author: string;
	reviewed: string;
	minutes: number;
	sections: GuideSection[];
};

export type Cta = {
	placementTag: string;
	offerType: 'newsletter' | 'lead_form' | 'affiliate' | 'digital_product';
	headline: string;
	description: string | null;
	buttonText: string;
	destinationUrl: string;
	analyticsEventName: string;
};

export const CATEGORIES: { id: VenueCategory | 'all'; label: string }[] = [
	{ id: 'all', label: 'All' },
	{ id: 'coworking', label: 'Coworking' },
	{ id: 'cafe', label: 'Cafés' },
	{ id: 'clinic', label: 'Clinics' },
	{ id: 'apartment', label: 'Apartments' },
	{ id: 'visa_agent', label: 'Visa agents' }
];

export function categoryLabel(category: VenueCategory): string {
	return CATEGORIES.find((item) => item.id === category)?.label ?? category;
}

export function tierLabel(tier: number): string {
	return '$'.repeat(tier);
}
