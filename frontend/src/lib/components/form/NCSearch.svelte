<script lang="ts">
	import Icon from '$lib/components/general/Icon.svelte';
	import debounce from '$lib/assets/utils/debounce';
	import { createEventDispatcher } from 'svelte';

	export let placeholder: string = 'Поиск';

	let searchValue: string = '';
	let focused: boolean = false;
	let dispatch = createEventDispatcher();

	const onInput = debounce(() => {
		dispatch('search', searchValue);
	}, 500);
</script>

<div class="nc-search {$$props.class}" class:nc-search_focused={focused}>
	<input
		type="search"
		class="nc-search__input"
		{placeholder}
		bind:value={searchValue}
		on:input={onInput}
		on:focusin={() => (focused = true)}
		on:focusout={() => (focused = false)}
	/>
	<Icon
		iconId={searchValue.length ? '' : 'search'}
		fill="grey"
		clickable={searchValue.length ? true : false}
		on:click={() => (searchValue = '')}
	/>
</div>

<style lang="postcss">
	.nc-search {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 7px 10px;

		border: 1px solid var(--grey);

		transition: border-color 0.2s ease-in-out;

		&_focused {
			border-color: var(--primary);
		}

		&__input {
			width: 100%;

			&:focus-visible {
				outline: none;
			}
		}
	}
</style>
