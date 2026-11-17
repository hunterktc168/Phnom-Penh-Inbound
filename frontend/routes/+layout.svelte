<script lang="ts">
	import '$lib/styles.css';
	import Header from '$lib/Header.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<title>Inbound — Phnom Penh</title>
	<meta
		name="description"
		content="Verified venues and practical guides for visiting or living in Phnom Penh."
	/>
</svelte:head>

<div class="shell">
	<Header />
	<main>
		{@render children()}
	</main>
	<footer class="site-footer">
		<div class="wrap">
			<p>Inbound records venues only after a verification date and a completeness check.</p>
			<p>Figures on this preview are sample records shaped like the production directory. They are not a live feed.</p>
		</div>
	</footer>
</div>
