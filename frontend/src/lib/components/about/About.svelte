<script lang="ts">
	const items = [
		{
			title: 'Помочь ближнему',
			description:
				'Знание языка жестов позволит общаться с глухими и слабослышащими людьми, помогать им в повседневной жизни',
			img: '/images/help.png',
			width: '336',
			alt: 'Изображение иконки с запросом помощи'
		},
		{
			title: 'Расширение кругозора',
			description:
				'Изучение жестового языка — это не только новый способ коммуникации, но и погружение в уникальную культуру',
			img: '/images/book.png',
			width: '289',
			alt: 'Изображение открытой книги с лампочкой над ней'
		},
		{
			title: 'Развитие когнитивных способностей',
			description:
				'развивает зрительную память, внимание, координацию, способность к невербальной коммуникации',
			img: '/images/brain.png',
			width: '224',
			alt: 'Изображение мозга'
		},
		{
			title: 'Увлекательное хобби',
			description:
				'Это не только новый способ коммуникации, но и погружение в уникальную изучение языка жестов — это новый способ самовыражения, умение передавать эмоции и мысли без слов.',
			img: '/images/hobbies.png',
			width: '339',
			alt: 'Изображение различных предметов над экраном телефона'
		},
		{
			title: 'Возможности для карьеры',
			description:
				'Знание языка жестов — это востребованный навык во многих сферах: образовании, медицине, социальной работе, юриспруденции, искусстве',
			img: '/images/avatar_2.png',
			width: '433',
			alt: 'Изображение мозга'
		}
	];
</script>

<section class="about" id="about">
	<h2 class="about__title section-title">
		Чем полезно <br /> обучение жестовому языку?
	</h2>
	<ul class="about__list">
		{#each items as item}
			<li class="about__card card">
				<h3 class="card__title">{item.title}</h3>
				<p class="card__description">{item.description}</p>
				<img class="card__img" src={item.img} alt={item.alt} width={item.width} />
			</li>
		{/each}
	</ul>
</section>

<style lang="postcss">
	.about {
		padding-top: 60px;
		padding-bottom: 56px;
	}

	/* .about__title {
		margin-bottom: 50px;

		font-family: Inter, sans-serif;
		font-style: normal;
		font-size: 40px;
		line-height: normal;
		font-weight: 600;
		color: var(--color-black);
	} */

	.about__list {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));

		gap: 24px;
	}

	.card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 20px;
		padding: 35px;

		font-family: Inter, sans-serif;
		font-style: normal;
		line-height: normal;

		background-color: #f3f6ff;
		border-radius: 20px;
		align-items: center;
	}

	.card__title {
		max-width: 226px;
		font-size: 28px;
		font-weight: 700;
		text-align: center;
	}

	.card__description {
		max-width: 336px;
		margin-bottom: auto;

		font-size: 16px;
		font-weight: 300;

		text-align: center;
	}

	.card__img {
		height: 150px;
		width: unset;
	}
	.card:last-child {
		position: relative;
		grid-row: 1/3;
		grid-column: 3/4;
		aspect-ratio: 0;

		padding-bottom: 0;

		color: var(--color-white);
		background-color: var(--color-primary);
	}

	.card:last-child .card__img {
		position: absolute;
		right: 42px;
		bottom: 0;
		width: 370px;
		height: unset;
	}
</style>
