<script lang="ts">
	import { slide } from 'svelte/transition';

	let props = $props();

	function collapseHandler() {
		props.open(props.id);
	}
</script>

<li class="faq__item faq-item">
	<button class="faq-item__button" onclick={collapseHandler}>
		<h3 class="faq-item__title">{props.title}</h3>
		{#if props.isOpen}<img class="faq-item__img" src="/icons/minus.svg" alt="minus" />
		{:else}
			<img class="faq-item__img" src="/icons/plus.svg" alt="plus" />
		{/if}
	</button>
	{#if props.isOpen}
		<p class="faq-item__text" transition:slide={{ duration: 300, axis: 'y' }}>
			{props.content}
		</p>
	{/if}
</li>

<style>
	.faq-item {
		width: 100%;
		border: 4px solid var(--color-white);
		border-radius: 10px;
	}

	.faq-item__title {
		font-size: 25px;
		font-weight: 600;
	}

	.faq-item__img {
		width: 40px;
		height: 40px;
		padding: 5px;

		background: var(--color-white);
		border-radius: 50%;
	}

	.faq-item__button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		min-height: 78px;
		padding-right: 24px;
		padding-left: 34px;

		color: var(--color-black);
		border: none;
		border-radius: 10px;

		background: #f3f6ff;
	}

	.faq-item__text {
		padding: 32px 34px;
		white-space: pre-line;
		font-size: 18px;
		color: var(--color-black);

		background-color: transparent;
	}
</style>
