<footer class="footer" id="footer">
	<h2 class="visually-hidden">Контактная информация</h2>
	<div class="container footer__wrapper">
		<img src="./icons/light-logo.svg" alt="logo" width="200" height="182" />
		<div class="footer__info">
			<div class="footer__contacts">
				<h3 class="footer__subtitle">Как с нами связаться</h3>
				<a class="footer__phone" href="tel:+79224171802">+7 (922) 417-18-02</a>
			</div>
			<div class="footer__socials socials">
				<h3 class="footer__subtitle">Мы в соцсетях:</h3>
				<div class="socials__wrapper">
					<img src="/icons/vk.svg" alt="Вконтакте" />
					<img src="/icons/telegram.svg" alt="Телеграм" />
				</div>
			</div>
		</div>
		<img src="images/qr.png" alt="QR-код" width="110" height="116" />
	</div>
</footer>

<style>
	.footer {
		padding-top: 20px;
		padding-bottom: 20px;

		background-color: var(--color-primary);
	}

	.footer__wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		padding-right: 60px;
		padding-left: 60px;
	}

	.footer__info {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 20px;
	}
	.footer__subtitle {
		font-size: 20px;
		font-weight: 500;
		color: var(--color-white);
	}
	.footer__phone {
		font-size: 16px;
		font-weight: 300;
		color: var(--color-white);
	}

	.socials__wrapper {
		display: flex;
		gap: 10px;
		margin-top: 5px;
	}
</style>
