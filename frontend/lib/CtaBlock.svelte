<script lang="ts">
	import { track } from '$lib/analytics';
	import type { Cta } from '$lib/data';

	let { cta }: { cta: Cta } = $props();

	// Restrict the recorded event to the closed set the endpoint accepts.
	const eventName = $derived(
		cta.analyticsEventName === 'email_submitted' ? 'email_submitted' : 'cta_click'
	);

	function onClick() {
		track({
			eventName,
			placementTag: cta.placementTag,
			metadata: { offer: cta.offerType }
		});
	}
</script>

<aside class="cta">
	<div class="cta-copy">
		<h3>{cta.headline}</h3>
		{#if cta.description}
			<p class="meta">{cta.description}</p>
		{/if}
	</div>
	<a class="btn btn-primary" href={cta.destinationUrl} onclick={onClick}>{cta.buttonText}</a>
</aside>
