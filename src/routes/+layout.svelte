<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let theme = 'light';

	onMount(() => {
		// Get initial theme
		if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
			theme = localStorage.getItem('theme') || 'light';
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			theme = 'dark';
		}

		// Apply theme
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}

		// Add scrollbar behavior
		let scrollTimeout: ReturnType<typeof setTimeout>;
		const handleScroll = () => {
			document.documentElement.style.setProperty('--scrollbar-opacity', '1');
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(() => {
				document.documentElement.style.setProperty('--scrollbar-opacity', '0.1');
			}, 1000);
		};
		document.addEventListener('scroll', handleScroll);

		return () => {
			document.removeEventListener('scroll', handleScroll);
		};
	});

	function toggleTheme() {
		const element = document.documentElement;
		element.classList.toggle('dark');

		const isDark = element.classList.contains('dark');
		theme = isDark ? 'dark' : 'light';
		localStorage.setItem('theme', theme);
	}
</script>

<svelte:head>
	<script>
		// Immediately set theme to prevent flash
		const theme = (() => {
			if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
				return localStorage.getItem('theme');
			}
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				return 'dark';
			}
			return 'light';
		})();

		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	</script>
</svelte:head>

<header
	class="fixed w-full bg-[var(--color-bg)]/80 backdrop-blur-sm z-50 border-b border-[var(--color-text)]/10"
>
	<nav class="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
		<a href="/" class="text-xl font-medium link-hover">pryority</a>
		<div class="flex items-center gap-8">
			<a href="/blog" class="link-hover">thoughts</a>
			<a href="/rides" class="link-hover">rides</a>
			<a href="/map" class="link-hover">map</a>
			<a href="/about" class="link-hover">about</a>
			<button
				on:click={toggleTheme}
				class="p-2 rounded-lg hover:bg-[var(--color-text)]/5 transition-colors"
				aria-label="Toggle theme"
			>
				<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						class="sun-icon {theme === 'dark' ? 'block' : 'hidden'}"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
					/>
					<path
						class="moon-icon {theme === 'light' ? 'block' : 'hidden'}"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
					/>
				</svg>
			</button>
		</div>
	</nav>
</header>

<main class="max-w-2xl mx-auto px-4 pt-24 pb-16">
	<slot />
</main>

<footer class="border-t border-[var(--color-text)]/10">
	<div class="max-w-2xl mx-auto px-4 py-8">
		<div class="flex justify-between items-center text-sm text-[var(--color-text)]/60">
			<p>© {new Date().getFullYear()} pryority</p>
			<div class="flex gap-4">
				<a href="/rss.xml" class="link-hover">rss</a>
			</div>
		</div>
	</div>
</footer>
