<script>
	export let checked = false;
	export let label = '';
</script>

<label class="label {$$props.class}">
	{#if label}
		<span class="label__text">{label}</span>
	{/if}
	<div class="switch">
		<input type="checkbox" bind:checked on:change />
		<span class="slider" />
	</div>
</label>

<style>
	.label {
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: row-reverse;
		gap: 10px;

		cursor: pointer;
	}

	.switch {
		position: relative;
		display: inline-block;
		min-width: 44px;
		height: 24px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--grey);
		-webkit-transition: 0.4s;
		transition: 0.4s;
		border-radius: 34px;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 16px;
		width: 16px;
		left: 4px;
		bottom: 4px;
		background-color: var(--white);
		-webkit-transition: 0.4s;
		transition: 0.4s;
		border-radius: 50%;
	}

	input:checked + .slider {
		background-color: var(--primary);
	}

	input:checked + .slider {
		box-shadow: 0 0 5px var(--primary);
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(20px);
		-ms-transform: translateX(20px);
		transform: translateX(20px);
	}
</style>
