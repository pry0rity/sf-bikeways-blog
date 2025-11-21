<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Rides - pryority</title>
	<meta name="description" content="A collection of my cycling adventures through San Francisco." />
</svelte:head>

<div class="space-y-16">
	<section class="space-y-4">
		<h1>latest rides</h1>
		<p class="text-[var(--color-text)]/60">
			A collection of my cycling adventures through San Francisco.
		</p>
	</section>

	<section class="space-y-12">
		{#each data.rides as ride}
			<article class="group">
				<a href="/rides/{ride.slug}" class="block space-y-3">
					<div class="space-y-1">
						<h2 class="link-hover inline-block">{ride.data.title}</h2>
						<p class="text-[var(--color-text)]/60 leading-relaxed">
							{ride.data.description}
						</p>
					</div>

					<div class="flex items-center gap-4 text-sm text-[var(--color-text)]/40">
						<time>
							{new Date(ride.data.date).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</time>
						<span>
							{(ride.data.distance / 1000).toFixed(1)}km • {Math.round(ride.data.elevation)}m
							elevation
						</span>
					</div>
				</a>
			</article>
		{/each}
	</section>
</div>
