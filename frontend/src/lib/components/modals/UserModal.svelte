<script>
	import { fade, slide } from 'svelte/transition';
	import { onDestroy, onMount } from 'svelte';

	let { children, close } = $props();

	// const dispatch = createEventDispatcher();

	// export let idOpenModal = false;

	function onClose() {
		// dispatch('close');
		close();
	}

	onMount(() => {
		document.body.style.overflowY = 'hidden';
	});

	onDestroy(() => {
		document.body.style.overflowY = 'auto';
	});
</script>

<div class="shadow" transition:fade={{ duration: 150 }}>
	<div class="modal">
		<button class="modal__btn" onclick={onClose}>X</button>
		{@render children()}
	</div>
</div>

<style lang="postcss">
	.shadow {
		position: fixed;
		inset: 0;

		display: flex;
		justify-content: center;
		align-items: center;

		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 100;
	}
	.modal {
		position: relative;
		max-height: 100vh;
		background-color: white;
		overflow: hidden;
		overflow-y: auto;
		min-width: 500px;
		border-radius: 15px;
		padding: 50px 30px 30px 30px;
	}
	.modal__btn {
		position: absolute;
		right: 0;
		top: 0;
		z-index: 3;

		display: flex;
		justify-content: center;
		align-items: center;
		width: 50px;
		height: 50px;

		background-color: var(--color-primary);
		border-radius: 0 0 0 50%;
		border: none;

		transition: all 0.15s ease-in;

		cursor: pointer;
		outline: none;

		&:hover {
			background-color: var(--color-primary-lighter);
		}
	}
</style>
