<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '../general/Icon.svelte';
	import NcDropdown from './NCDropdown.svelte';
	import NcTimeScroll from './NCTimeScroll.svelte';
	let isOpen = false;
	type Time = {
		hours?: number;
		minutes?: number;
	};
	export let placeholder: string = 'ЧЧ:ММ';
	export let bordered: boolean = true;
	// export let value: Time = { minutes: undefined, hours: undefined };
	export let timeValue: string | undefined = '00:00';
	if (timeValue === undefined) {
		timeValue = '00:00';
	}

	const dispatch = createEventDispatcher();

	function timeParse(time: string) {
		const [hours, minutes] = time.split(':');
		return { hours: parseInt(hours), minutes: parseInt(minutes) };
	}

	function timeFormat(time: Time) {
		if (time === undefined || time.hours === undefined || time.minutes === undefined) {
			return '00:00';
		}
		const hours = (time.hours < 10 ? '0' : '') + time.hours;
		const minutes = (time.minutes < 10 ? '0' : '') + time.minutes;
		return hours + ':' + minutes;
	}

	let value = timeParse(timeValue);
	$: {
		timeValue = timeFormat(value);
		dispatch('change');
	}

	let cTime: string | null = null;
	$: {
		if (value.hours === undefined && value.minutes === undefined) {
			cTime = null;
		}

		let res = '';
		if (value.hours !== undefined) {
			res += value.hours >= 10 ? `${value.hours}:` : `0${value.hours}:`;
		} else {
			res += '--:';
		}
		if (value.minutes !== undefined) {
			res += value.minutes > 10 ? `${value.minutes}` : `0${value.minutes}`;
		} else {
			res += '--';
		}
		cTime = res;
	}

	function onClear() {
		value.hours = 0;
		value.minutes = 0;
		isOpen = false;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<NcDropdown bind:isOpen>
	<svelte:fragment slot="trigger">
		<div
			class="nc-time-picker"
			class:nc-time-picker_bordered={bordered}
			role="button"
			tabindex="0"
			on:click={() => (isOpen = true)}
		>
			<span
				class:nc-time-picker__value_empty={value.hours === undefined || value.minutes === undefined}
			>
				{cTime || placeholder}
			</span>
			<Icon iconId="clock" fill="primary" />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="content">
		<NcTimeScroll
			bind:hoursValue={value.hours}
			bind:minutesValue={value.minutes}
			on:clear={onClear}
		/>
	</svelte:fragment>
</NcDropdown>

<style lang="postcss">
	.nc-time-picker {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		padding: 5px 0;

		&_bordered {
			border-bottom: 1px solid var(--grey);
		}
		&:hover {
			cursor: pointer;
		}

		&__value_empty {
			color: var(--grey);
		}
	}
</style>
