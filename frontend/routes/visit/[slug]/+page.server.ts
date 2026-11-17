import { error } from '@sveltejs/kit';
import { getActiveCta, getGuide } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const guide = await getGuide('visit', params.slug);
	if (!guide) throw error(404, 'Guide not found or unpublished');

	const cta = await getActiveCta('guide_spoke_footer');
	return { guide, cta };
};
