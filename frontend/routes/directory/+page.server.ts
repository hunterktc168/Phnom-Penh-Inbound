import { getActiveCta, getDirectoryVenues } from '$lib/server/content';
import type { PageServerLoad } from './$types';

// The active/completeness/recency gates are applied in the query (the table's
// RLS policies express the same rule). Only the visitor's own filters —
// category and generator — are layered on top.
export const load: PageServerLoad = async ({ url }) => {
	const category = url.searchParams.get('category');
	const generator = url.searchParams.get('generator') === 'true';

	const [venues, cta] = await Promise.all([
		getDirectoryVenues({ category, generator }),
		getActiveCta('directory_sidebar')
	]);

	return { venues, cta, filters: { category: category ?? 'all', generator } };
};
