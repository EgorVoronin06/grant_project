<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();
	function generateTimes(max: number) {
		const hours: { label: string; value: number }[] = [];
		for (let i = 0; i < max; i++) {
			if (i < 10) {
				hours.push({ label: `0${i}`, value: i });
				continue;
			}
			hours.push({ label: String(i), value: i });
		}
		return hours;
	}
	const hours = generateTimes(24);
	const minutes = generateTimes(60);

	let hoursList: HTMLUListElement;
	let minutesList: HTMLUListElement;

	export let hoursValue: number | undefined;
	export let minutesValue: number | undefined;

	function onClickItem(e: Event, model: 'hours' | 'minutes') {
		const element = e.target as HTMLElement;
		const parentElement = element.parentElement;
		if (!parentElement) return;
		const val = element.dataset.value;
		if (val && model === 'hours') {
			hoursValue = parseInt(val);
			scrollToActiveHour();
		}
		if (val && model === 'minutes') {
			minutesValue = parseInt(val);
			scrollToActiveMinute();
		}
	}
	function scrollToActiveHour() {
		if (hoursValue === undefined) return;
		const activeHour = hoursList.querySelector(`[data-value="${hoursValue}"]`);
		const parentRect = hoursList.getBoundingClientRect();
		const elementRect = activeHour!.getBoundingClientRect();
		const topRelativeToParent = elementRect.top - parentRect.top + hoursList.scrollTop - 80 + 17;
		hoursList.scrollTop = topRelativeToParent;
	}
	function scrollToActiveMinute() {
		if (minutesValue === undefined) return;
		const activeMinute = minutesList.querySelector(`[data-value="${minutesValue}"]`);
		const parentRect = minutesList.getBoundingClientRect();
		const elementRect = activeMinute!.getBoundingClientRect();
		const topRelativeToParent = elementRect.top - parentRect.top + minutesList.scrollTop - 80 + 17;
		minutesList.scrollTop = topRelativeToParent;
	}

	onMount(() => {
		scrollToActiveHour();
		scrollToActiveMinute();
	});
</script>

<div class="nc-time-scroll">
	<span class="nc-time-scroll__label">Часы</span>
	<span class="nc-time-scroll__label">Минуты</span>
	<ul class="nc-time-scroll__list" bind:this={hoursList}>
		{#each hours as hour}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<li
				class="nc-time-scroll__list-item"
				class:nc-time-scroll__list-item_active={hour.value === hoursValue}
				data-value={hour.value}
				on:click={(e) => onClickItem(e, 'hours')}
			>
				{hour.label}
			</li>
		{/each}
	</ul>
	<ul class="nc-time-scroll__list" bind:this={minutesList}>
		{#each minutes as minute}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<li
				class="nc-time-scroll__list-item"
				class:nc-time-scroll__list-item_active={minute.value === minutesValue}
				on:click={(e) => onClickItem(e, 'minutes')}
				data-value={minute.value}
			>
				{minute.label}
			</li>
		{/each}
	</ul>
	<div class="nc-time-scroll__controls">
		<button class="nc-time-scroll__controls-clear" on:click={() => dispatch('clear')}
			>Очистить</button
		>
	</div>
</div>

<style lang="postcss">
	.nc-time-scroll {
		width: 150px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		border: 1px solid var(--grey);

		&__label {
			font-size: 12px;
			color: var(--grey);
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 1px solid var(--grey);
			padding: 5px 0;
		}
		&__list {
			scroll-behavior: smooth;
			max-height: 170px;
			overflow-y: auto;
			user-select: none;
			scrollbar-width: none; /* Скрываем стандартный скролл в Firefox */
			-ms-overflow-style: none; /* Скрываем стандартный скролл в IE и Edge */
			&::-webkit-scrollbar {
				display: none; /* Скрываем стандартный скролл в WebKit */
			}
			&::before {
				content: '';
				display: block;
				width: 100%;
				height: 63px;
			}
			&::after {
				content: '';
				display: block;
				width: 100%;
				height: 73px;
			}
			&-item {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 5px;
				scroll-snap-align: start;
				&:hover {
					color: var(--primary);
					cursor: pointer;
				}
				&_active {
					background-color: var(--primary);
					color: var(--white);
					&:hover {
						color: var(--white);
					}
				}
			}
		}
		&__controls {
			grid-column-start: 1;
			grid-column-end: 3;
			border-top: 1px solid var(--grey);
		}
		&__controls-clear {
			color: var(--primary);
			padding: 5px 0;
			width: 100%;
		}
	}
</style>
