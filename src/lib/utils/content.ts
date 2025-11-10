import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export interface BlogPost {
	slug: string;
	data: {
		title: string;
		description: string;
		date: Date;
		image?: string;
		tags?: string[];
		location?: string;
		coffeeShop?: string;
		routeName?: string;
		bikeType?: string;
		weather?: string;
		musicTitle?: string;
		musicUrl?: string;
		gear?: {
			camera?: string;
			bike?: string;
			other?: string[];
		};
		coordinates?: {
			lat: number;
			lng: number;
		};
	};
	content: string;
}

export interface Ride {
	slug: string;
	data: {
		title: string;
		description: string;
		date: Date;
		distance: number;
		elevation: number;
		duration: number;
		stravaId: string;
		geojson: {
			type: string;
			geometry: {
				type: string;
				coordinates: number[][];
			};
			properties: Record<string, unknown>;
		};
	};
	content: string;
}

export function getBlogPosts(): BlogPost[] {
	const blogDir = join(process.cwd(), 'src', 'content', 'blog');
	const files = readdirSync(blogDir).filter((file) => file.endsWith('.md'));

	return files.map((file) => {
		const filePath = join(blogDir, file);
		const fileContent = readFileSync(filePath, 'utf-8');
		const { data, content } = matter(fileContent);

		return {
			slug: file.replace('.md', ''),
			data: {
				...data,
				date: new Date(data.date)
			} as BlogPost['data'],
			content
		};
	});
}

export function getRides(): Ride[] {
	const ridesDir = join(process.cwd(), 'src', 'content', 'rides');
	const files = readdirSync(ridesDir).filter((file) => file.endsWith('.md'));

	return files.map((file) => {
		const filePath = join(ridesDir, file);
		const fileContent = readFileSync(filePath, 'utf-8');
		const { data, content } = matter(fileContent);

		return {
			slug: file.replace('.md', ''),
			data: {
				...data,
				date: new Date(data.date)
			} as Ride['data'],
			content
		};
	});
}

export function getRoutes() {
	const routesFile = join(process.cwd(), 'src', 'data', 'routes.json');
	return JSON.parse(readFileSync(routesFile, 'utf-8'));
}
