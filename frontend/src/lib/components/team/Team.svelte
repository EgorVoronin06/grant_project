<script lang="ts">
	import StatisticCard from './StatisticCard.svelte';

	let stats = [
		{
			count: 12,
			description: 'миллионов человек в России имеют нарушения слуха'
		},
		{
			count: 90,
			description: 'процентов глухих детей рождается у слышащих родителей'
		},
		{
			count: 30,
			description:
				'процентов глухих трудоустроены, и, по большей части, это низкоквалифи­цированный труд'
		}
	];
</script>

<div class="team">
	<div class="container team__container">
		<div class="team__person">
			<h2 class="section-title team__title team__title--top">Команда NeedCode</h2>
			<div class="team__photos">
				<img
					src="/images/dream-team.png"
					alt="Команда NeedCode в полном составе"
					width="556"
					height="536"
				/>
			</div>
		</div>
		<div class="team__information team-information">
			<p class="team-information__greeting">Всем привет!</p>
			<p class="team-information__text">
				Мы команда, созданная в рамках Хантатона 2025. Наш выбор кейсового задания “Интерактивная
				платформа для изучения жестового языка” не случаен. С проблемами неслышащих людей мы знакомы
				не понаслышке. В семье наших двух членов команды есть трое неслышащих родных. На протяжении
				почти 30 лет никто из слышащих членов семьи не освоил жестовый язык, так как в нашем городе
				он преподавался только в коррекционной школе для глухих, которую могли посещать только дети
				с ОВЗ.
			</p>

			<div class="team-information__list">
				{#each stats as item}
					<StatisticCard {...item} />
				{/each}
			</div>
			<h2 class="section-title team__title team__title--bottom">Кто мы и что создали?</h2>
		</div>
	</div>
</div>

<style>
	.team {
		margin-bottom: 60px;

		background: #f3f6ff url(/images/background-team.svg) no-repeat;
		background-size: cover;
	}

	.team__container {
		display: grid;
		/* display: flex; */
		grid-template-columns: 1fr 1fr;
		gap: 35px;
		padding: 60px 0 60px 0;
	}

	.team__person {
		padding-top: 40px;
	}

	.team__title {
		position: relative;

		width: 70%;
		padding: 20px;
		margin-bottom: 0;

		font-size: 30px;
		border-radius: 10px 10px 0 0;
		text-align: center;
		color: var(--color-white);
		background-color: var(--color-primary);
	}

	.team__title--top::after {
		content: '';
		position: absolute;
		bottom: 0;

		width: 165px;
		height: 165px;
		background-image: url('images/avatar_4.png');
	}

	.team__title--bottom {
		position: absolute;
		right: 0;
		bottom: -75px;

		width: 67%;

		border-radius: 0 0 10px 10px;
	}

	.team__title--bottom::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: -75px;

		width: 165px;
		height: 165px;
		background-image: url('images/avatar_5.png');
	}

	.team__photos {
		padding-top: 40px;
	}

	.team__information {
		position: relative;

		display: flex;
		flex-direction: column;
		padding: 30px 35px 10px 35px;
		height: 600px;
		background-color: var(--color-white);
		border-radius: 10px 10px 0 10px;
	}

	.team-information__greeting {
		margin-bottom: 30px;

		font-weight: 600;
		font-size: 40px;
		color: #393939;
	}

	.team-information__text {
		font-size: 16px;
		/* margin-bottom: 60px; */
	}

	.team-information__list {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		margin-top: auto;
	}
</style>
