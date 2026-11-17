<script lang="ts">
	import CtaBlock from './CtaBlock.svelte';
	import type { Cta, Guide } from './data';

	let {
		guide,
		pillarLabel,
		cta = null
	}: { guide: Guide; pillarLabel: string; cta?: Cta | null } = $props();
</script>

<article class="article">
	<a class="back" href="/{guide.pillar}">← {pillarLabel}</a>
	<p class="kicker">{pillarLabel}</p>
	<h1>{guide.title}</h1>
	<p class="dek">{guide.dek}</p>
	<p class="byline">{guide.author} · reviewed {guide.reviewed} · {guide.minutes} min</p>
	{#each guide.sections as section}
		<section>
			<h2>{section.heading}</h2>
			{#each section.body as paragraph}
				<p>{paragraph}</p>
			{/each}
		</section>
	{/each}
	{#if cta}
		<CtaBlock {cta} />
	{/if}
</article>
