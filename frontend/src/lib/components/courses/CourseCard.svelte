<script lang="ts">
	let props = $props();
</script>

<div class="course-card card hover-lift stagger-item">
	<img
		class="card__image"
		src="/icons/sign-lang-logo.svg"
		alt="Логотип РЖЯ"
		width="105"
		height="40"
	/>
	<p class="card__level">({props.level} уровень)</p>
	<h3 class="card__title">Результаты освоения курса</h3>
	<h4 class="card__subtitle">Знание:</h4>
	<ul class="card__list">
		{#each props.knowledge as knowledge}
			<li class="card__item">{knowledge}</li>
		{/each}
	</ul>
	<h4 class="card__subtitle">Умение:</h4>
	<ul class="card__list">
		{#each props.ability as ability}
			<li class="card__item">{ability}</li>
		{/each}
	</ul>
	<h4 class="card__subtitle">Владение:</h4>
	<ul class="card__list">
		{#each props.ownership as ownership}
			<li class="card__item">{ownership}</li>
		{/each}
	</ul>
	<a href="./lessons/1" class="card__link">Пройти</a>
</div>

<style>
	.course-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 15px 30px;

		background-color: var(--color-white);
		border-radius: 20px;
	}

	.card__image {
		margin-bottom: 20px;
	}

	.card__level {
		margin-bottom: 30px;

		font-size: 28px;
		line-height: 1;
		font-weight: 600;
	}

	.card__title {
		margin-bottom: 30px;

		font-size: 16px;
		font-weight: 600;
	}

	.card__subtitle {
		align-self: flex-start;
		font-size: 16px;
		font-weight: 300;
	}

	.card__list {
		align-self: flex-start;

		margin-bottom: 20px;
		padding-left: 10px;
	}

	.card__item {
		list-style-type: disc;
	}

	.card__link {
		margin-top: auto;
		padding: 10px 90px;

		font-size: 16px;
		font-weight: 600;
		color: var(--color-white);
		background-color: var(--color-primary);
		border-radius: 10px;
	}
</style>
