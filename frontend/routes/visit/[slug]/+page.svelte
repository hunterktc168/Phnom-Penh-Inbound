<script lang="ts">
	import GuideArticle from '$lib/GuideArticle.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.guide.title} — Inbound</title>
</svelte:head>

<GuideArticle guide={data.guide} cta={data.cta} pillarLabel="Visit" />
