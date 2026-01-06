<script lang="ts">
	// import type { IBtnSize } from '$lib/types/types';
	import { createEventDispatcher } from 'svelte';
	export let href = '';
	export let size: 'small' | 'big' | 'medium' = 'big';
	export let primary: boolean = false;
	export let disabled: boolean = false;
	export let full: boolean = false;
	export let color: string = 'grey';
	const dispatch = createEventDispatcher();

	const btnRole = {
		small: 'small',
		big: 'big',
		medium: 'medium'
	};

	function getClass(): string {
		return `${btnRole[size]}`;
	}

	$: classSize = getClass();
</script>

{#if href}
	<a
		{href}
		class="button {classSize} {$$props.class} button--grey"
		class:button--primary={primary}
		class:w-full={full}
	>
		<slot />
	</a>
{:else}
	<button
		on:click={() => dispatch('click')}
		class="button {classSize} {$$props.class} button--{color}"
		class:button--primary={primary}
		class:w-full={full}
		{disabled}
	>
		<slot />
	</button>
{/if}

<style lang="postcss">
	.button {
		position: relative;

		display: inline-flex;
		gap: 10px;
		align-items: center;
		justify-content: center;
		height: 38px;

		font-size: 16px;
		line-height: 20px;

		border: none;
		border-radius: 8px;
		font-weight: normal;
	}

	.small {
		padding: 0 5px;
		font-size: 12px;
		font-weight: 500;
	}

	.big {
		/* TODO переделать ширину */
		/* width: 283px; */
		padding: 13px;
		font-weight: 500;
	}

	.medium {
		padding: 9px 25px;
	}

	.button--grey {
		background-color: var(--light-grey);

		transition: background-color 0.2s ease-in;
	}

	.button--grey:hover {
		background-color: var(--grey);
	}

	.button--primary {
		background-color: var(--color-primary);
		color: white;
	}

	.button--black {
		background-color: var(--dark);
		color: var(--primary);
	}

	.button--primary:hover {
		background-color: var(--color-primary-lighter);
		cursor: pointer;
	}

	.button:disabled {
		background-color: var(--grey);
		opacity: 0.5;
	}
</style>
