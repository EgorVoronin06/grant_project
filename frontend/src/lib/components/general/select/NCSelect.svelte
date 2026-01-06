<script context="module" lang="ts">
	export type Option<T> = {
		label: string;
		value: T;
		disabled?: boolean;
	};
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import NcDropdown from '../dropdown/NCDropdown.svelte';
	import NcErrorInput from '../../form/NCErrorInput.svelte';
	import NcIconSvg from '../../general/NCIconSvg.svelte';

	type T = $$Generic;
	export let options: Option<T>[];
	export let value: T | undefined = undefined;
	export let placeholder: string = 'Не выбрано';
	export let searchable: boolean = false;
	export let error: Array<string> | undefined = undefined;
	export let checkPosition: boolean = true;
	export let disabled: boolean = false;

	$: isOpen && dispatch('focus');
	let dispatch = createEventDispatcher();
	let isOpen = false;
	$: selectedLabel = options.find((i) => i.value === value)?.label || '';

	function onSelect(val: T) {
		value = val;
		selectedLabel = options.find((i) => i.value === value)?.label || '';
		isOpen = false;
		dispatch('select', val);
	}

	function onClear() {
		value = undefined;
		isOpen = false;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
<NcDropdown bind:isOpen width="full" {checkPosition}>
	<svelte:fragment slot="trigger">
		<div class="nc-select {$$props.class}">
			<input
				class="nc-select__input nc-select__input_{value}"
				class:nc-select_opened={isOpen}
				type="text"
				value={selectedLabel}
				{placeholder}
				readonly={!searchable}
				on:click={() => (isOpen = true)}
				on:input
				{disabled}
			/>
			<!-- {#if value !== undefined}
				<NcIconSvg
					class="absolute right-[10px] top-[50%] -translate-y-[50%]"
					iconId="clear"
					width={15}
					clickable
					fill="black"
					on:click={onClear}
				/>
			{/if} -->
			<NcErrorInput {error} />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="content">
		<ul class="nc-select__options">
			{#each options as option}
				<li
					class="nc-select__options-item"
					class:nc-select__options-item_selected={option.value === value}
					role="button"
					tabindex="0"
					on:click={() => onSelect(option.value)}
				>
					{option.label}
				</li>
			{/each}
		</ul>
	</svelte:fragment>
</NcDropdown>

<style lang="postcss">
	.nc-select {
		position: relative;
		padding-top: 5px;
		padding-bottom: 10px;
		margin-bottom: 10px;
		&__input {
			border-bottom: 1px solid var(--grey);
			width: 100%;
			padding: 5px 0;
			background: none;

			&:hover {
				cursor: pointer;
			}
			&:focus-visible {
				outline: none;
			}
			&:disabled {
				cursor: unset;
				pointer-events: none;
			}
			&_created {
				padding: 10px;

				color: white;
				background-color: var(--order-created-color);
			}
			&_completed {
				padding: 10px;

				color: white;
				background-color: var(--order-completed-color);
			}
			&_delivery {
				padding: 10px;

				color: white;
				background-color: var(--order-delivery-color);
			}
			&_cancelled {
				padding: 10px;

				color: white;
				background-color: var(--order-cancelled-color);
			}
			&_confirmed {
				padding: 10px;

				color: white;
				background-color: var(--order-confirmed-color);
			}
			&_dispute {
				padding: 10px;

				color: white;
				background-color: var(--order-dispute-color);
			}
		}
		&__options {
			display: flex;
			flex-direction: column;
			max-height: 400px;
			overflow-y: auto;
			&-item {
				padding: 5px;
				position: relative;
				&_selected::before {
					position: absolute;
					right: 10px;
					top: 50%;
					transform: translateY(-50%);
					content: '';
					width: 10px;
					height: 10px;
					background: var(--primary);
				}
				&_selected::after {
					position: absolute;
					left: 0;
					top: 0;
					bottom: 0;
					content: '';
					width: 2px;
					background: var(--primary);
				}
				&:hover {
					background: var(--primary);
				}
			}
			&-item:last-child {
				border-top: 1px solid var(--gray);
			}
		}
		&_opened {
			border-color: var(--primary);
		}
	}
</style>
