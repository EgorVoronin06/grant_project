<section class="benefit animate-fade-in">
	<div class="benefit__image animate-scale-in">
		<img src="/images/avatar_3.png" alt="avatar_3" class="hover-scale" />
	</div>
	<div class="benefit__info animate-slide-up">
		<h2 class="section-title benefit__title">
			Кому полезен наш сервис и образовательные материалы?
		</h2>
		<ul class="benefit__list">
			<li class="benefit__item">слышащим родителям детей с нарушенным слухом</li>
			<li class="benefit__item">педагогам массовых детских садов, школ и университетов</li>
			<li class="benefit__item">волонтерам и добровольцам</li>
			<li class="benefit__item">всем слышащим людям</li>
			<li class="benefit__item">
				НКО, которые работают с проблемами нарушения слуха и развивают проекты в области инклюзии
			</li>
			<li class="benefit__item">
				организациям или бизнесу для создания доступных для глухих и слабослышащих людей продуктов
				или услуг/ инклюзивных рабочих мест
			</li>
		</ul>
	</div>
</section>

<style>
	.benefit {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 50px;
		align-items: center;
	}

	.benefit__image {
		padding: 60px;

		background: url('images/background-cloud.svg');
		background-repeat: no-repeat;
		background-size: 110%;
		background-position: -65% 65%;
	}
	.benefit__title {
		margin-bottom: 20px;
	}
	.benefit__item {
		position: relative;

		padding-left: 10px;
	}

	.benefit__item::before {
		content: '• ';
		position: absolute;
		top: 1px;
		left: 0;
	}
</style>
