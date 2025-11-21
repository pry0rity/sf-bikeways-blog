import { getRides } from '$lib/utils/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const rides = getRides().sort(
		(a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
	);

	return {
		rides
	};
};
