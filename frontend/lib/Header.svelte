<script lang="ts">
	import { page } from '$app/state';

	const path = $derived(page.url.pathname);

	function current(href: string): 'page' | undefined {
		if (href === '/') return path === '/' ? 'page' : undefined;
		return path === href || path.startsWith(href + '/') ? 'page' : undefined;
	}
</script>

<header class="site-header">
	<div class="wrap header-row">
		<a class="brand" href="/">
			<strong>Inbound</strong>
			<span>Phnom Penh</span>
		</a>
		<nav class="nav" aria-label="Primary">
			<a href="/directory" aria-current={current('/directory')}>Directory</a>
			<a href="/visit" aria-current={current('/visit')}>Visit</a>
			<a href="/live" aria-current={current('/live')}>Live</a>
		</nav>
	</div>
</header>
