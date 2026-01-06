<script lang="ts">
	let { count, description } = $props();
</script>

<div class="card">
	<p class="card__count">{count}</p>
	<p class="card__description">{description}</p>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		flex: 1;
	}

	.card__count {
		font-size: 60px;
		line-height: 1;
		font-weight: 600;
		color: var(--color-primary);
	}

	.card__description {
		font-size: 16px;
		font-weight: 300;
		text-align: center;
	}
</style>
