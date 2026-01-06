<script lang="ts">
	import NCErrorInput from './NCErrorInput.svelte';

	export let label: string | null = null;
	export let value: unknown = undefined;
	export let error: Array<string> | undefined = undefined;
	export let rows = 5;
</script>

<div class="nc-textarea {$$props.class}">
	<textarea
		class="nc-textarea__field"
		class:nc-textarea_filled={value || value === 0}
		bind:value
		{rows}
	/>
	{#if label !== null}
		<label class="nc-textarea__label" for="nc-textarea">
			{label}
		</label>
	{/if}
	<NCErrorInput {error} />
</div>

<style lang="postcss">
	.nc-textarea {
		position: relative;
		padding-top: 10px;
		padding-bottom: 4px;
		margin-bottom: 20px;

		&__field {
			border: none;
			border-bottom: 1px solid var(--grey);
			appearance: none;
			font-size: 16px;
			width: 100%;
			background: none;
			resize: none;
			&:focus-visible {
				outline: none;
			}
			&:focus {
				border-bottom: 1px solid var(--primary);
			}
		}
		&__label {
			white-space: nowrap;
			width: 100%;
			color: var(--grey);
			position: absolute;
			left: 0;
			top: 10px;
			transition: all 0.1s linear;
			cursor: text;
			pointer-events: none;
		}

		&__field:focus,
		&_filled {
			& + .nc-textarea__label {
				font-size: 12px;
				top: -4px;
			}
		}
	}
</style>
