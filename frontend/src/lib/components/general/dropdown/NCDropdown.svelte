<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import { fade } from 'svelte/transition';
	import { afterUpdate } from 'svelte';

	export let isOpen: boolean = false;
	export let width: 'fit' | 'full' = 'fit';
	export let checkPosition: boolean;
	let menu: HTMLElement;
	let dropdown: HTMLDivElement;
	let position: 'top' | 'bottom' | undefined = undefined;

	function checkMenuPosition() {
		if (!menu) {
			return;
		}
		const dropdownRect = dropdown.getBoundingClientRect();
		const menuRect = menu.getBoundingClientRect();
		const bottomSpace = window.innerHeight - dropdownRect.bottom;

		if (bottomSpace < menuRect.height) {
			position = 'top';
		} else {
			position = 'bottom';
		}
	}

	afterUpdate(() => {
		if (isOpen && checkPosition) {
			checkMenuPosition();
		}
	});
</script>

<div
	class="nc-dropdown {$$props.class}"
	use:clickOutside={() => (isOpen = false)}
	class:nc-dropdown_fit={width === 'fit'}
	class:nc-dropdown_full={width === 'full'}
	bind:this={dropdown}
>
	<slot name="trigger" />
	{#if isOpen}
		<div
			class="nc-dropdown__menu"
			class:nc-dropdown_top={position === 'top'}
			class:nc-dropdown_bottom={position === 'bottom'}
			class:nc-dropdown_fit={width === 'fit'}
			class:nc-dropdown_full={width === 'full'}
			transition:fade={{ duration: 100 }}
			bind:this={menu}
		>
			<slot name="content" />
		</div>
	{/if}
</div>

<style lang="postcss">
	.nc-dropdown {
		position: relative;
		&_top {
			top: auto;
			bottom: calc(100% - 5px);
		}
		&_bottom {
			bottom: auto;
			top: calc(100% - 5px);
		}
		&_full {
			width: 100%;
		}
		&_fit {
			width: fit-content;
		}
		&__menu {
			background: var(--white);
			position: absolute;
			left: 0;
			z-index: 100;
			box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.05);
		}
	}
</style>
