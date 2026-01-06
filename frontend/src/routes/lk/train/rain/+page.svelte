<script>
	import RainGame from '$lib/components/ai/RainGame.svelte';
</script>

<div class="train-page">
	<div class="train-page__bar">
		<h1>Тренажер "Спринт"</h1>
	</div>
	<div class="train-page__content">
		<RainGame />
	</div>
</div>

<style>
	.train-page {
		display: grid;
		grid-template-rows: auto 1fr;
		gap: 10px;
		height: 100%;
	}
	.train-page__bar {
		background: white;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px;
		border: 1px solid var(--color-primary-transparent);
	}
	.train-page__content {
		gap: 70px;
		background-color: white;
		border: 1px solid var(--color-primary-transparent);
		padding: 10px;
		border-radius: 10px;
		/* flex-grow: 1; */
	}
</style>
