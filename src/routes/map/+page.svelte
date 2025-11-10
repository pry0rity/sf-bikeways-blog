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
	<title>SF Bike Routes Map - pryority</title>
	<meta
		name="description"
		content="Interactive map of all documented bike routes in San Francisco."
	/>
</svelte:head>

<div class="space-y-8">
	<section class="space-y-4">
		<h1>SF Bike Routes Map</h1>
		<p class="text-[var(--color-text)]/80 text-lg">
			Explore all documented bike routes in San Francisco. Click on any route to view its
			details and read the full ride report.
		</p>
	</section>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div class="p-4 rounded-lg border border-[var(--color-text)]/10">
			<h3 class="text-sm text-[var(--color-text)]/60">Total Rides</h3>
			<p class="text-2xl font-medium">{data.totalRides}</p>
		</div>
		<div class="p-4 rounded-lg border border-[var(--color-text)]/10">
			<h3 class="text-sm text-[var(--color-text)]/60">Total Distance</h3>
			<p class="text-2xl font-medium">{data.totalDistance.toFixed(1)} km</p>
		</div>
		<div class="p-4 rounded-lg border border-[var(--color-text)]/10">
			<h3 class="text-sm text-[var(--color-text)]/60">Total Elevation</h3>
			<p class="text-2xl font-medium">{Math.round(data.totalElevation)} m</p>
		</div>
	</div>

	<div class="rounded-lg overflow-hidden border border-[var(--color-text)]/10">
		<Map height="600px" />
	</div>

	<section class="space-y-4">
		<h2>Recent Rides</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each data.routes.slice(0, 6) as route}
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
	</section>
</div>
