<script lang="ts">
	import { fade } from "svelte/transition";

	export let error: string | undefined = undefined;
</script>

{#if error !== undefined}
	<p
		transition:fade={{ delay: 250, duration: 300 }}
		class="text-red-600 error-message {$$props.class}"
	>
		{error}
	</p>
{/if}

<style>
	.error-message {
		position: absolute;
		bottom: 0;
		right: 0;
		width: auto;

		font-size: 14px;

		/* transform: translateX(-70%); */
	}
</style>
