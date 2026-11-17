// @ts-nocheck
import { getPillarGuides } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load = async () => {
	return { guides: await getPillarGuides('live') };
};
;null as any as PageServerLoad;