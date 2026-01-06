<script lang="ts">
	import AccordionItem from './AccordionItem.svelte';
	let openId = $state(3);

	function openHandler(id: number) {
		openId = id;
	}

	const accordionItems = [
		{
			id: 1,
			title: 'Может ли учиться ребенок?',
			content: `
			`
		},
		{
			id: 2,
			title: 'Возможно ли групповое обучение?',
			content: ''
		},
		{
			id: 3,
			title: 'Можно ли принять участие в пополнении словаря?',
			content:
				'Да, для этого на платформе существует сервис, который позволяет вам сделать видеозапись жеста в онлайн режиме, ввести слово с клавиатуры и отправить нам. После валидации слово появится в словаре.'
		},
		{
			id: 4,
			title: 'С каких устройств можно проходить обучение?',
			content: ``
		},
		{
			id: 5,
			title: 'Выдаете ли вы какой-либо документ о прохождении обучения?',
			content: ''
		}
	];
</script>

<section class="faq">
	<div class="faq__wrapper">
		<h2 class="faq__title section-title">FAQ - ответы на <br />частые вопросы</h2>
		<ul class="faq__list">
			{#each accordionItems as accordionItem}
				<AccordionItem {...accordionItem} open={openHandler} isOpen={accordionItem.id === openId} />
			{/each}
		</ul>
	</div>
</section>

<style>
	.faq__wrapper {
		/* margin-top: -54px; */
		padding-top: 54px;
		padding-bottom: 70px;

		background-color: #fff;
	}

	.faq__title {
		margin-bottom: 50px;
	}

	.faq__list {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}
</style>
