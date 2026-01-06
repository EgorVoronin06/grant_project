<script lang="ts">
	let { title, description, icon } = $props();
</script>

<div class="card">
	<div class="card__image">
		<img src={icon} alt={title} />
	</div>
	<h3 class="card__title">{title}</h3>
	<p class="card__description">{description}</p>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		flex: 1;
		height: 230px;
		padding: 20px 80px 40px 80px;

		background-color: var(--color-white);
		border-radius: 20px;
	}

	.card__image {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40px;
		margin-bottom: 11px;
	}

	.card__title {
		max-width: 390px;

		text-align: center;
		font-size: 25px;
		line-height: 1.15;
		font-weight: 600;
		/* color: var(--color-primary); */
	}

	.card__description {
		max-width: 390px;
		margin-top: auto;

		font-size: 16px;
		font-weight: 300;
		text-align: center;
	}
</style>
