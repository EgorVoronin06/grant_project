<script lang="ts">
	import { fade } from 'svelte/transition';

	export let error: Array<string> | undefined = undefined;
</script>

{#if error !== undefined}
	<p transition:fade={{ delay: 250, duration: 300 }} class="text-red-600 error-message">
		{error.join(', ')}
	</p>
{/if}

<style>
	.error-message {
		position: absolute;
		bottom: -10px;
		left: 0;
		width: auto;
		font-size: 12px;
		/* transform: translateX(-70%); */
	}
</style>
