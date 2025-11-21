<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>thoughts - pryority</title>
	<meta name="description" content="Blog posts about cycling, technology, and life." />
</svelte:head>

<div class="space-y-8">
	<div class="space-y-2">
		<h1>thoughts</h1>
		<p class="text-[var(--color-text)]/60">
			Writing about bikes, tech, and whatever else is on my mind.
		</p>
	</div>

	<div class="space-y-16">
		{#each data.posts as post}
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
</div>
