<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Live — Inbound</title>
</svelte:head>

<div class="wrap page-title">
	<p class="kicker">Live</p>
	<h1>Notes for a lease, not a weekend.</h1>
	<p class="lede">Rent, power, and the paperwork that should happen before you feel settled. Reviewed on a six-month clock.</p>
</div>

<section class="section">
	<div class="wrap grid-2">
		{#each data.guides as guide (guide.slug)}
			<a class="card" href="/live/{guide.slug}">
				<div class="mark"></div>
				<div class="card-body">
					<p class="meta">{guide.minutes} min · reviewed {guide.reviewed}</p>
					<h3>{guide.title}</h3>
					<p>{guide.dek}</p>
				</div>
			</a>
		{/each}
	</div>
</section>
