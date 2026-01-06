<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';
	import type { TabCtxType } from './NCTabs.svelte';
	import { writable } from 'svelte/store';

	export let open: boolean = false;
	export let title: string;

	const dispatch = createEventDispatcher();
	const ctx = getContext<TabCtxType>('ctx') ?? {};
	const selected = ctx.selected ?? writable<HTMLElement>();

	function init(node: HTMLElement) {
		selected.set(node);

		const destroy = selected.subscribe((x) => {
			if (x !== node) {
				open = false;
			}
		});

		return { destroy };
	}

	function onOpen() {
		open = true;
		dispatch('open');
	}
</script>

<li class="nc-tab-item" class:nc-tab-item_active={open}>
	<button on:click={onOpen} role="tab" {...$$restProps}>
		<slot name="title">{title}</slot>
	</button>
</li>
{#if open}
	<div class="hidden">
		<div use:init>
			<slot />
		</div>
	</div>
{/if}

<style lang="postcss">
	.nc-tab-item {
		padding: 5px 10px;
		position: relative;
		&::before {
			transition: opacity 0.3s ease-in-out;
			opacity: 0;
			content: '';
			height: 2px;
			background: var(--primary);
			position: absolute;
			bottom: -1px;
			left: 0;
			right: 0;
		}
		&_active::before {
			opacity: 1;
		}
	}
</style>
