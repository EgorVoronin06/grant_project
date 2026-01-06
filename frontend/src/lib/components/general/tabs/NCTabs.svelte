<script context="module" lang="ts">
	import { writable, type Writable } from 'svelte/store';

	export interface TabCtxType {
		selected: Writable<HTMLElement>;
	}
</script>

<script lang="ts">
	import { setContext } from 'svelte';

	const ctx: TabCtxType = {
		selected: writable<HTMLElement>()
	};
	setContext('ctx', ctx);

	function init(node: HTMLElement) {
		const destroy = ctx.selected.subscribe((x: HTMLElement) => {
			node.style.opacity = '0';
			setTimeout(() => {
				if (x) node.replaceChildren(x);
				node.style.opacity = '1';
			}, 200);
		});
		return { destroy };
	}
</script>

<ul class="tabs {$$props.class}">
	<slot />
</ul>
<div class="tabs__content" use:init></div>

<style lang="postcss">
	.tabs {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		border-bottom: 1px solid var(--gray);
		&__content {
			transition: opacity 0.2s ease-in;
			margin-top: 20px;
		}
	}
</style>
