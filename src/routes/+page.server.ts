import { getBlogPosts, getRoutes } from '$lib/utils/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const posts = getBlogPosts().sort(
		(a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
	);

	const routes = getRoutes().sort(
		(a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	return {
		posts,
		routes
	};
};
