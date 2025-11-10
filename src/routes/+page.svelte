<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function handleRouteCardHover(routeId: number, isHovering: boolean) {
		const event = new CustomEvent('routeCardHover', {
			detail: { routeId, isHovering }
		});
		document.dispatchEvent(event);
	}
</script>

<svelte:head>
	<title>pryority</title>
	<meta
		name="description"
		content="Personal blog about cycling, technology, and life in San Francisco."
	/>
</svelte:head>

<div class="space-y-24">
	<section class="space-y-6">
		<div class="space-y-2">
			<h1>pryority's priorities</h1>
			<p class="text-[var(--color-text)]/80 text-lg">
				You know the deal. It's a bike blog. But kinda not. Idk.
			</p>
		</div>

		<div class="flex gap-4 text-sm text-[var(--color-text)]/60">
			<a href="https://github.com/pry0rity" class="link-hover">github</a>
			<a href="https://twitter.com/pry0rity" class="link-hover">x (please don't hate me)</a>
			<a href="https://bsky.app/profile/pry0rity.bsky.social" class="link-hover">bsky</a>
		</div>
	</section>

	<section class="space-y-8">
		<div class="flex items-center gap-4">
			<h2><a href="/blog" class="link-hover">latest thoughts</a></h2>
			<div class="h-px flex-1 bg-[var(--color-text)]/10"></div>
		</div>

		<div class="space-y-16">
			{#each data.posts.slice(0, 3) as post}
				<article class="group">
					<a
						href="/blog/{new Date(post.data.date).getFullYear()}/{String(
							new Date(post.data.date).getMonth() + 1
						).padStart(2, '0')}/{post.slug}"
						class="block space-y-3"
					>
						<div class="space-y-1">
							<h3 class="link-hover inline-block">{post.data.title}</h3>
							<p class="text-[var(--color-text)]/60 leading-relaxed">
								{post.data.description}
							</p>
						</div>

						<div class="flex items-center gap-4 text-sm text-[var(--color-text)]/40">
							<time>
								{new Date(post.data.date).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</time>
							{#if post.data.tags && post.data.tags.length > 0}
								<span class="flex gap-2">
									{#each post.data.tags as tag}
										<span class="link-hover text-xs">{tag}</span>
									{/each}
								</span>
							{/if}
						</div>
					</a>
				</article>
			{/each}
		</div>
	</section>

	<section class="space-y-8">
		<div class="flex items-center gap-4">
			<h2><a href="/map" class="link-hover">latest rides</a></h2>
			<div class="h-px flex-1 bg-[var(--color-text)]/10"></div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each data.routes.slice(0, 3) as route}
				<a
					href={route.blogUrl}
					class="p-4 rounded-lg border border-[var(--color-text)]/10 hover:border-[var(--color-text)]/20 transition-colors route-card"
					data-route-id={route.id}
					on:mouseenter={() => handleRouteCardHover(route.id, true)}
					on:mouseleave={() => handleRouteCardHover(route.id, false)}
				>
					<h3 class="link-hover inline-block">{route.title}</h3>
					<p class="text-sm text-[var(--color-text)]/60 mt-1">
						{(route.distance / 1000).toFixed(1)}km • {Math.round(route.elevation)}m elevation
					</p>
					<p class="text-sm text-[var(--color-text)]/60">
						{new Date(route.date).toLocaleDateString()}
					</p>
				</a>
			{/each}
		</div>

		<div class="rounded-lg overflow-hidden border border-[var(--color-text)]/10">
			<Map height="400px" />
		</div>
	</section>

	<section class="space-y-8">
		<div class="flex items-center gap-4">
			<h2>current inspo</h2>
			<div class="h-px flex-1 bg-[var(--color-text)]/10"></div>
		</div>
		<!-- Currently Reading -->
		<div
			class="flex gap-4 items-start bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm p-6"
		>
			<img
				src="https://covers.openlibrary.org/b/isbn/9780465050659-M.jpg"
				alt="The Design of Everyday Things book cover"
				class="w-24 h-36 object-cover rounded-md shadow"
				loading="lazy"
			/>
			<div class="flex-1 space-y-2">
				<h3 class="font-semibold text-lg">The Design of Everyday Things</h3>
				<p class="text-sm text-[var(--color-text)]/60 mb-1">by Don Norman</p>
				<p class="text-sm text-[var(--color-text)]/80">
					A fascinating exploration of how design affects our daily lives and why some products
					satisfy customers while others only frustrate them.
				</p>
			</div>
		</div>
		<!-- Currently Listening -->
		<div class="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm p-4">
			<iframe
				src="https://open.spotify.com/embed/album/3hXswlXaEoYMiBQ9TZN2wR"
				width="100%"
				height="352"
				frameborder="0"
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
				loading="lazy"
				class="rounded-lg"
				title="Spotify Player"
			></iframe>
		</div>
	</section>
</div>
