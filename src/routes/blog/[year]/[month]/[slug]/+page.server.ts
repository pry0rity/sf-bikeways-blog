import { getBlogPosts } from '$lib/utils/content';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const posts = getBlogPosts();
	const post = posts.find((p) => {
		const postDate = new Date(p.data.date);
		const year = postDate.getFullYear().toString();
		const month = String(postDate.getMonth() + 1).padStart(2, '0');
		return p.slug === params.slug && year === params.year && month === params.month;
	});

	if (!post) {
		throw error(404, 'Post not found');
	}

	return {
		post
	};
};

export const entries = () => {
	const posts = getBlogPosts();
	return posts.map((post) => {
		const date = new Date(post.data.date);
		return {
			year: date.getFullYear().toString(),
			month: String(date.getMonth() + 1).padStart(2, '0'),
			slug: post.slug
		};
	});
};
