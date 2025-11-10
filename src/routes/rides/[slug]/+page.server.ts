import { getRides } from '$lib/utils/content';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const rides = getRides();
	const ride = rides.find((r) => r.slug === params.slug);

	if (!ride) {
		throw error(404, 'Ride not found');
	}

	return {
		ride
	};
};

export const entries = () => {
	const rides = getRides();
	return rides.map((ride) => ({
		slug: ride.slug
	}));
};
