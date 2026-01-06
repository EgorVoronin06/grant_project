<script lang="ts">
	import CourseCard from '$lib/components/courses/CourseCard.svelte';
	import AICamera from '$lib/components/ai/AICamera.svelte';
	import { type FrameData } from '$lib/interfaces/frame-data.interface';

	const courses = [
		{
			level: '1',
			knowledge: [
				'основ лексики и грамматики РЖЯ 1-го (начального) уровня.',
				'особенности взаимодействия с глухими и слабослышащими людьми'
			],
			ability: [
				'понимать обращённую речь на РЖЯ в рамках пройденных тем и отвечать на вопросы,',
				'рассказывать о себе, своей семье, профессии, предпочтениях'
			],
			ownership: ['коммуникативными навыками на РЖЯ в соответствии с 1-ым уровнем обучения.']
		},
		{
			level: '2',
			knowledge: ['особенности взаимодействия с глухими и слабослышащими людьми'],
			ability: [
				'осуществлять последовательный перевод с русского языка на РЖЯ и наоборот',
				'рассказывать о себе, своей семье, профессии, предпочтениях'
			],
			ownership: ['коммуникативными навыками на РЖЯ в соответствии с 2-ым уровнем обучения']
		},
		{
			level: '1+',
			knowledge: ['основных грамматических конструкций 1-го уровня РЖЯ'],
			ability: ['выстраивать фразы с учетом грамматики РЖЯ', 'дактилировать слова'],
			ownership: ['РЖЯ на базовом 1 уровне.']
		}
	];

	let liveFrame: Partial<FrameData> = $state({
		face: undefined,
		hands: undefined,
		pose: undefined,
		timestamp: 0
	});

	function handleCameraCallback(data: Partial<FrameData>[], name: string) {
		console.log('Camera callback:', { data, name });
	}
</script>

<div class="courses-page">
	<div class="courses-page__bar">
		<h1>Курсы</h1>
	</div>
	<div class="courses-page__wrapper">
		<div class="courses-page__camera">
			<AICamera width={640} height={480} bind:frame={liveFrame} cb={handleCameraCallback} />
		</div>
		<div class="courses-page__content">
			{#each courses as course (course.level)}
				<CourseCard {...course} />
			{/each}
		</div>
	</div>
</div>

<style>
	.courses-page {
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
	}
	.courses-page__bar {
		background: white;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px;
		border: 1px solid var(--color-primary-transparent);
	}
	.courses-page__wrapper {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 20px;
		flex-grow: 1;
		align-items: start;
	}
	.courses-page__camera {
		background: white;
		border-radius: 10px;
		padding: 10px;
		border: 1px solid var(--color-primary-transparent);
		position: sticky;
		top: 80px;
	}
	.courses-page__content {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 30px;
		padding: 10px 35px;
		flex-grow: 1;
	}

	@media (max-width: 1200px) {
		.courses-page__wrapper {
			grid-template-columns: 1fr;
		}
		.courses-page__camera {
			position: relative;
			top: 0;
		}
		.courses-page__content {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.courses-page__content {
			grid-template-columns: 1fr;
			padding: 10px;
		}
	}
</style>
