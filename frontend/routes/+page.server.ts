import { getHomeStats, getLocations, getPillarGuides } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [locations, live, visit, stats] = await Promise.all([
		getLocations(),
		getPillarGuides('live'),
		getPillarGuides('visit'),
		getHomeStats()
	]);
	// The three most recent guides across both pillars, for the "From the desk" strip.
	const featured = [...live, ...visit].slice(0, 3);
	return { locations, featured, stats };
};
