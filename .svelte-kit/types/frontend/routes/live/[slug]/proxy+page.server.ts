// @ts-nocheck
import { error } from '@sveltejs/kit';
import { getActiveCta, getGuide } from '$lib/server/content';
import type { PageServerLoad } from './$types';

// A single published guide for the pillar — the table's RLS policy restricts
// anonymous readers to `is_published = true`, and the query repeats that gate.
export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
	const guide = await getGuide('live', params.slug);
	if (!guide) throw error(404, 'Guide not found or unpublished');

	const cta = await getActiveCta('guide_spoke_footer');
	return { guide, cta };
};
