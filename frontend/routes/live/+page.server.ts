import { getPillarGuides } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { guides: await getPillarGuides('live') };
};
