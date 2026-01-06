<script lang="ts">
	import { onMount } from 'svelte';

	export let count: number = 4;
	export let value: string = '';

	let code = Array(count).fill('');
	let inputElements: HTMLInputElement[] = [];

	function onDelete(idx: number) {
		if (!code[idx - 1] && idx > 1) {
			inputElements[idx - 2].focus();
		}
	}

	onMount(() => {
		inputElements[0].focus();
	});

	function onInput(event: Event, idx: number) {
		const input = event.target as HTMLInputElement;
		const newValue = input.value.replace(/\D/g, '');
		code[idx] = newValue;

		if (newValue && idx < count - 1) {
			inputElements[idx + 1].focus();
		}
	}

	$: {
		const val = code.join('');
		value = val;

		const firstEmptyIdx = code.findIndex((c) => !c);
		inputElements[firstEmptyIdx]?.focus();
	}
</script>

<div>
	<div class="nc-code-input {$$props.class}">
		{#each Array(+count) as _, idx}
			<input
				bind:this={inputElements[idx]}
				bind:value={code[idx]}
				type="tel"
				maxlength="1"
				on:input={(e) => onInput(e, idx)}
				on:keydown={(e) => e.key === 'Backspace' && onDelete(idx + 1)}
			/>
		{/each}
	</div>
</div>

<style lang="postcss">
	.nc-code-input {
		display: grid;
		grid-gap: 15px;
		grid-auto-flow: column;
		grid-template-rows: 95px;
		input {
			font-size: min(10vw, 60px);
			text-align: center;
			width: 100%;
			border-radius: 8px;
			border: var(--base-border-width, 1px) solid var(--gray);
			color: var(--plain-color);
			transition: border-color 0.1s ease-in;
			&:focus {
				border-color: var(--primary);
			}
		}
	}
</style>
