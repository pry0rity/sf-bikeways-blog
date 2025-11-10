import { getRoutes } from '$lib/utils/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const routes = getRoutes();

	const totalDistance = routes.reduce((sum: number, route: any) => sum + route.distance, 0) / 1000;
	const totalElevation = routes.reduce((sum: number, route: any) => sum + route.elevation, 0);
	const totalRides = routes.length;

	return {
		routes,
		totalDistance,
		totalElevation,
		totalRides
	};
};
