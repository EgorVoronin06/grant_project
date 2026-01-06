<script lang="ts">
	export let label: string | undefined = undefined;
	export let labelPosition: 'left' | 'right' = 'right';
	export let value = false;
</script>

<label class="nc-checkbox {$$props.class}" class:nc-checkbox_checked={value}>
	{#if label && labelPosition === 'left'}
		<span>{label}</span>
	{/if}
	<input type="checkbox" class="nc-checkbox__input" bind:checked={value} on:change />
	{#if label && labelPosition === 'right'}
		<span>{label}</span>
	{/if}
</label>

<style lang="postcss">
	.nc-checkbox {
		position: relative;

		display: flex;
		align-items: center;
		gap: 5px;
		width: fit-content;
		height: 20px;
		padding-left: 30px;

		user-select: none;

		&:hover {
			cursor: pointer;
		}
		&__input {
			display: none;
		}
		&::before {
			position: absolute;
			left: 0;
			content: '';

			display: block;
			width: 20px;
			height: 20px;

			border: 1px solid var(--grey);
		}
		&::after {
			position: absolute;
			left: 5px;
			content: '';

			display: block;
			width: 10px;
			height: 10px;

			background-color: var(--primary);
			opacity: 0;

			transition: opacity 0.1s ease-in-out;
		}
		&_checked::after {
			opacity: 1;
		}
		&_checked::before {
			border-color: 1px solid var(--primary);
		}
	}
</style>
