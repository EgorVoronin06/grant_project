<script lang="ts">
	// import { createEventDispatcher } from 'svelte';

	let props = $props();

	let iconId: string = props.iconId || '';
	let width: number = props.width || 20;
	let height: number = props.height || width;
	let fill: string = props.fill || 'color-primary';
	let clickable: boolean = props.clickable || false;

	// const dispatch = createEventDispatcher();
	const onClick = () => {
		if (clickable) {
			props.click();
		}
	};

	const onKeyUp = (e: KeyboardEvent) => {
		if (clickable) {
			props.keyup(e);
		}
	};
</script>

{#if iconId}
	<svg
		class="nc-icon {props.class}"
		class:clickable
		viewBox="0 0 {width} {height}"
		{width}
		{height}
		fill="var(--{fill})"
		onclick={onClick}
		onkeyup={onKeyUp}
		role="button"
		tabindex="0"
	>
		<use xlink:href="/icons/sprite.svg#{iconId}" />
	</svg>
{/if}

<style>
	.nc-icon:focus {
		outline: none;
	}
	svg {
		display: block;
		transition: fill 0.1s linear;
	}

	.clickable:hover {
		cursor: pointer;
		fill: var(--primary) !important;
	}
</style>
