<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let small: boolean = false;
	export let min: number = 1;
	export let max: number = 3;
	export let value: number = 1;
	export let step: number = 1;
	export let bgColor = 'light-grey';
	export let color = 'dark';
	// export let price = false;

	const dispatch = createEventDispatcher();

	function decrement() {
		if (value === min) {
			value = value - step;
			dispatch('delete');
		}
		if (value > min) {
			value = value - step;
		}
	}

	function increment() {
		if (value < max) {
			value = value + step;
		}
	}
</script>

<div
	style="background-color: var(--{bgColor}); color: var(--{color})"
	class="number-input"
	class:number-input_sm={small}
>
	<button class="number-input__button" type="button" on:click|stopImmediatePropagation={decrement}>
		-
	</button>

	<div class="number-input__value">
		{value}
	</div>

	<button class="number-input__button" type="button" on:click|stopImmediatePropagation={increment}>
		+
	</button>
</div>

<style lang="postcss">
	.number-input {
		display: inline-grid;
		text-align: center;
		align-items: center;
		grid-auto-flow: column;
		width: 100%;
		font-size: 20px;
		border-radius: 999px;
		overflow: hidden;
	}

	.number-input_sm {
		font-size: 14px;
		line-height: 14px;
		height: 24px;

		& .number-input__value {
			min-width: 20px;
		}
	}

	.number-input__value {
		text-align: center;
		user-select: none;
		color: var(--dark);
		min-width: 50px;
	}

	.number-input__button {
		border: none;
		background: none;
		outline: none !important;
		height: 100%;
	}
</style>
