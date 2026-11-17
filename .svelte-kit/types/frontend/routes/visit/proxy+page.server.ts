// @ts-nocheck
import { getPillarGuides } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load = async () => {
	return { guides: await getPillarGuides('visit') };
};
;null as any as PageServerLoad;