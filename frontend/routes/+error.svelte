<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="wrap page-title" style="padding-bottom: 64px;">
	<p class="kicker">Missing</p>
	<h1>{page.status}</h1>
	<p class="lede">{page.error?.message ?? 'That page is not in the directory.'}</p>
	<p style="margin-top: 18px;"><a class="btn btn-primary" href="/">Back to the front</a></p>
</div>
