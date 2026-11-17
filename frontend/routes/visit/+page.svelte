<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Visit — Inbound</title>
</svelte:head>

<div class="wrap page-title">
	<p class="kicker">Visit</p>
	<h1>Short stays, with the errands handled first.</h1>
	<p class="lede">Guides for people who are here for days, not a lease. The aim is fewer transfers and one neighbourhood you can walk.</p>
</div>

<section class="section">
	<div class="wrap grid-2">
		{#each data.guides as guide (guide.slug)}
			<a class="card" href="/visit/{guide.slug}">
				<div class="mark clay"></div>
				<div class="card-body">
					<p class="meta">{guide.minutes} min · reviewed {guide.reviewed}</p>
					<h3>{guide.title}</h3>
					<p>{guide.dek}</p>
				</div>
			</a>
		{/each}
	</div>
</section>
