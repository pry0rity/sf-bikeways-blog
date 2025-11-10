<script lang="ts">
	import type { PageData } from './$types';
	import { marked } from 'marked';

	export let data: PageData;

	$: html = marked(data.post.content);
</script>

<svelte:head>
	<title>{data.post.data.title} - pryority</title>
	<meta name="description" content={data.post.data.description} />
</svelte:head>

<article class="space-y-8">
	<header class="space-y-4">
		<h1>{data.post.data.title}</h1>
		<p class="text-xl text-[var(--color-text)]/80">{data.post.data.description}</p>

		<div class="flex flex-wrap gap-4 text-sm text-[var(--color-text)]/60">
			<time>
				{new Date(data.post.data.date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</time>
			{#if data.post.data.location}
				<span>📍 {data.post.data.location}</span>
			{/if}
			{#if data.post.data.coffeeShop}
				<span>☕ {data.post.data.coffeeShop}</span>
			{/if}
			{#if data.post.data.weather}
				<span>🌤️ {data.post.data.weather}</span>
			{/if}
		</div>

		{#if data.post.data.tags && data.post.data.tags.length > 0}
			<div class="flex gap-2">
				{#each data.post.data.tags as tag}
					<span class="text-xs px-2 py-1 rounded bg-[var(--color-text)]/5">{tag}</span>
				{/each}
			</div>
		{/if}
	</header>

	<div class="prose">
		{@html html}
	</div>

	{#if data.post.data.musicTitle && data.post.data.musicUrl}
		<div class="border-t border-[var(--color-text)]/10 pt-8">
			<h3 class="text-sm text-[var(--color-text)]/60 mb-2">listening to while writing</h3>
			<a href={data.post.data.musicUrl} class="link-hover" target="_blank" rel="noopener">
				{data.post.data.musicTitle}
			</a>
		</div>
	{/if}
</article>
