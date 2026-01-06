<script lang="ts">
	import ToolCard from './ToolCard.svelte';

	let props = $props();

	let tools = [
		{
			title: 'Курсы и уроки',
			description: 'Обучение с видео инструкциями по различным темам и уровням сложности',
			icon: '/icons/courses.svg'
		},
		{
			title: 'Литература и вспомогательные материалы',
			description: 'Учебные пособия, статьи, новости, полезные ссылки',
			icon: '/icons/literature.svg'
		},
		{
			title: 'Интерактивное тестирование',
			description:
				'Интерактивные упражнения с обратной связью, основанные на распознавании жестов через камеру',
			icon: '/icons/interactive.svg'
		},
		{
			title: 'Мотивационная система наград и достижений',
			description:
				'Система отслеживания прогресса, рейтингов, поощряющая конкуренцию и взаимодействие',
			icon: '/icons/motivation.svg'
		}
	];
</script>

<section class="learning-tools">
	<div class="container learning-tools__containers">
		<h2 class="section-title learning-tools__title">Что Вас приведет к результату</h2>
		<div class="learning-tools__list tools">
			{#each tools as tool}
				<ToolCard {...tool} />
			{/each}
		</div>
	</div>
</section>

<style>
	.learning-tools {
		width: 100%;
		padding-top: 35px;
		padding-bottom: 100px;

		border-radius: 30px;
		background-color: var(--color-primary);
	}
	.learning-tools__containers {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.learning-tools__title {
		color: var(--color-white);
	}

	.tools {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 25px;
		padding: 0 25px;
	}
</style>
