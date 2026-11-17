<script lang="ts">
	let { data } = $props();
</script>

<div class="wrap hero">
	<div class="hero-copy">
		<p class="kicker">Cambodia inbound</p>
		<h1>A city you can actually plan around.</h1>
		<p class="lede">
			Neighbourhood notes, a venue directory that refuses stale listings, and short guides for a visit or a lease.
		</p>
		<div class="hero-actions">
			<a class="btn btn-primary" href="/directory">Browse the directory</a>
			<a class="btn btn-ghost" href="/live">Read for living here</a>
		</div>
		<div class="stat-row">
			<div class="stat"><b>{data.stats.sangkats}</b><span>Sangkats with rent notes</span></div>
			<div class="stat"><b>90</b><span>Days before a venue goes stale</span></div>
			<div class="stat"><b>5</b><span>Venue categories</span></div>
			<div class="stat"><b>{data.stats.venues}</b><span>Active listings right now</span></div>
		</div>
	</div>
	<figure class="hero-photo">
		<img src="/riverside.jpg" alt="Late afternoon along a tree-lined Phnom Penh quay" />
		<figcaption>Daun Penh, late afternoon. The river is orientation, not the whole city.</figcaption>
	</figure>
</div>

<section class="section">
	<div class="wrap">
		<div class="section-head">
			<h2>Where people actually stay</h2>
		</div>
		<div class="grid-2">
			{#each data.locations as location (location.slug)}
				<article class="card">
					<div class="mark"></div>
					<div class="card-body">
						<p class="meta">{location.parentRegion}</p>
						<h3>{location.name}</h3>
						<p>{location.summary}</p>
						{#if location.rent1br !== null || location.walkability !== null}
							<p class="meta">
								{#if location.rent1br !== null}1-bed about ${location.rent1br}/mo{/if}{#if location.rent1br !== null && location.walkability !== null} · {/if}{#if location.walkability !== null}walkability {location.walkability}{/if}
							</p>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="section" style="padding-top: 0;">
	<div class="wrap">
		<div class="section-head">
			<h2>From the desk</h2>
			<a href="/visit">All guides</a>
		</div>
		<div class="grid-3">
			{#each data.featured as guide (guide.slug)}
				<a class="card" href="/{guide.pillar}/{guide.slug}">
					<div class="mark" class:clay={guide.pillar === 'visit'}></div>
					<div class="card-body">
						<p class="meta">{guide.pillar === 'live' ? 'Live' : 'Visit'} · {guide.minutes} min</p>
						<h3>{guide.title}</h3>
						<p class="meta">{guide.dek}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
