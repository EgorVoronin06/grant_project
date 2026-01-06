<section class="feedback" id="feedback">
	<h2 class="section-title feedback__title">Не нашли ответ на ваш вопрос?</h2>
	<p class="feedback__text">Опишите его ниже и мы обязательно ответим</p>
	<form class="feedback__form">
		<textarea
			class="feedback__question"
			name="question"
			placeholder="Ваш вопрос"
			cols="30"
			rows="10"
		></textarea>
		<div class="feedback__fields">
			<input class="feedback__input" type="text" placeholder="Ваше имя" />
			<input class="feedback__input" type="text" placeholder="+7 (999) 999-99-99" />
			<button class="feedback__btn">Отправить</button>
		</div>
	</form>
</section>

<style lang>
	.feedback {
		margin-bottom: 60px;
		/* padding-top: 30px; */
		padding: 30px 120px 100px 120px;

		background: #f3f6ff;
		background-image: url(/images/bg-feedback.svg);
		border-radius: 20px;
	}

	.feedback__title {
		margin-bottom: 10px;

		text-align: center;
		font-size: 30px;
		font-weight: 600;
	}

	.feedback__text {
		margin-bottom: 30px;
		text-align: center;
		font-size: 16px;
		font-weight: 400;
	}
	.feedback__form {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.feedback__question {
		resize: none;
		padding: 20px;
		border-radius: 10px;
		border: none;
	}

	.feedback__fields {
		display: grid;
		grid-template-rows: repeat(3, 1fr);
		gap: 24px;
		padding-left: 24px;
	}
	.feedback__input {
		padding: 20px;
		border-radius: 10px;
		border: none;
	}

	.feedback__btn {
		font-size: 16px;
		color: var(--color-white);
		background: var(--color-primary);
		border-radius: 10px;
		border: none;
		cursor: pointer;

		transition: box-shadow 0.3s ease-in-out;
	}

	.feedback__btn:hover {
		box-shadow: 5px 5px 10px 0 #0000001e;
	}
</style>
