<script lang="ts">
	import { track } from '$lib/analytics';
	import CtaBlock from '$lib/CtaBlock.svelte';
	import { CATEGORIES, categoryLabel, tierLabel, type VenueCategory } from '$lib/data';

	let { data } = $props();

	function hrefFor(nextCategory: string, nextGenerator: boolean): string {
		const params = new URLSearchParams();
		if (nextCategory !== 'all') params.set('category', nextCategory);
		if (nextGenerator) params.set('generator', 'true');
		const query = params.toString();
		return query ? `/directory?${query}` : '/directory';
	}

	function onFilter(nextCategory: string, nextGenerator: boolean) {
		track({
			eventName: 'directory_filter_used',
			placementTag: 'directory',
			metadata: { category: nextCategory, generator: nextGenerator }
		});
	}

	function photo(kind: 'riverside' | 'cowork' | 'none'): string | null {
		if (kind === 'riverside') return '/riverside.jpg';
		if (kind === 'cowork') return '/cowork.jpg';
		return null;
	}
</script>

<svelte:head>
	<title>Directory — Inbound</title>
</svelte:head>

<div class="wrap page-title">
	<p class="kicker">Directory</p>
	<h1>Places that were checked, not scraped.</h1>
	<p class="lede">
		Active listings only: a verification date inside ninety days, and enough detail to be useful. Filter by what you actually need this week.
	</p>
	<div class="filters" role="group" aria-label="Category">
		{#each CATEGORIES as item}
			<a
				class="chip"
				href={hrefFor(item.id, data.filters.generator)}
				aria-current={data.filters.category === item.id ? 'true' : undefined}
				onclick={() => onFilter(item.id, data.filters.generator)}
			>
				{item.label}
			</a>
		{/each}
		<a
			class="chip"
			href={hrefFor(data.filters.category, !data.filters.generator)}
			aria-current={data.filters.generator ? 'true' : undefined}
			onclick={() => onFilter(data.filters.category, !data.filters.generator)}
		>
			Generator
		</a>
	</div>
</div>

<div class="wrap" style="padding-bottom: 56px;">
	{#if data.venues.length === 0}
		<p class="empty">Nothing in this cut of the directory. Clear the generator filter or choose another category.</p>
	{:else}
		<div class="venue-list">
			{#each data.venues as venue (venue.slug)}
				<article class="venue">
					<div class="venue-photo">
						{#if photo(venue.photo)}
							<img src={photo(venue.photo)} alt="" />
						{/if}
					</div>
					<div class="venue-main">
						<div class="venue-top">
							<div>
								<p class="pill">{categoryLabel(venue.category as VenueCategory)}</p>
								<h2 style="font-size: 28px; margin-top: 4px;">{venue.name}</h2>
							</div>
							<p class="meta">{tierLabel(venue.priceTier)}</p>
						</div>
						<p style="margin-top: 8px;">{venue.blurb}</p>
						<div class="facts">
							<span>{venue.locationName}</span>
							<span>{venue.hasGenerator ? 'Generator' : 'No generator'}</span>
							{#if venue.wifiMbps}
								<span>{venue.wifiMbps} Mbps checked</span>
							{/if}
							<span>Verified {venue.verifiedOn}</span>
							<span>Completeness {venue.completeness}</span>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{/if}

	{#if data.cta}
		<CtaBlock cta={data.cta} />
	{/if}
</div>
