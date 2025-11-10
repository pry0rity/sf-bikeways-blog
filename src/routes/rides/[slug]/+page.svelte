<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import type { PageData } from './$types';
	import { marked } from 'marked';

	export let data: PageData;

	$: html = marked(data.ride.content);
</script>

<svelte:head>
	<title>{data.ride.data.title} - pryority</title>
	<meta name="description" content={data.ride.data.description} />
</svelte:head>

<article class="space-y-8">
	<header class="space-y-4">
		<h1>{data.ride.data.title}</h1>
		<p class="text-xl text-[var(--color-text)]/80">{data.ride.data.description}</p>

		<div class="flex flex-wrap gap-4 text-sm text-[var(--color-text)]/60">
			<time>
				{new Date(data.ride.data.date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</time>
			<span>{(data.ride.data.distance / 1000).toFixed(1)}km</span>
			<span>{Math.round(data.ride.data.elevation)}m elevation</span>
			<span>{Math.floor(data.ride.data.duration / 60)}min</span>
		</div>
	</header>

	<div class="rounded-lg overflow-hidden border border-[var(--color-text)]/10">
		<Map height="400px" showControls={false} />
	</div>

	<div class="prose">
		{@html html}
	</div>

	{#if data.ride.data.stravaId}
		<div class="border-t border-[var(--color-text)]/10 pt-8">
			<a
				href="https://www.strava.com/activities/{data.ride.data.stravaId}"
				class="link-hover"
				target="_blank"
				rel="noopener"
			>
				View on Strava →
			</a>
		</div>
	{/if}
</article>
