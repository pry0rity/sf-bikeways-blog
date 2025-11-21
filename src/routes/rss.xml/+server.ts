import { getBlogPosts } from '$lib/utils/content';

export const prerender = true;

export async function GET() {
	const posts = getBlogPosts().sort(
		(a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
	);

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SF Bikeways Blog</title>
    <description>Exploring San Francisco by bike, one lane at a time</description>
    <link>https://sf-bikeways-blog.vercel.app</link>
    <atom:link href="https://sf-bikeways-blog.vercel.app/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    ${posts
			.map(
				(post) => `
    <item>
      <title>${post.data.title}</title>
      <description>${post.data.description}</description>
      <link>https://sf-bikeways-blog.vercel.app/blog/${new Date(post.data.date).getFullYear()}/${String(new Date(post.data.date).getMonth() + 1).padStart(2, '0')}/${post.slug}</link>
      <pubDate>${new Date(post.data.date).toUTCString()}</pubDate>
    </item>
    `
			)
			.join('')}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
