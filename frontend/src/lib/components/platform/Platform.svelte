<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	let user = $state<any>(null);
	
	onMount(() => {
		const userStr = localStorage.getItem('user');
		if (userStr) {
			try {
				user = JSON.parse(userStr);
			} catch (e) {
				console.error('Error parsing user:', e);
			}
		}
	});

	function handleStartLearning() {
		// Если пользователь авторизован - ведем в личный кабинет
		// Если нет - ведем на регистрацию
		if (user) {
			goto('/lk/profile');
		} else {
			goto('/register');
		}
	}
</script>

<section class="platform animate-fade-in">
	<div class="platform__info animate-slide-up">
		<h1 class="platform__heading">
			Интерактивная платформа для&nbsp;изучения русского жестового&nbsp;языка
		</h1>
		<div class="platform__description">
			Изучение жестового языка может быть таким же интересным, как и изучение любого иностранного
			языка
		</div>
		<button class="button hover-lift" on:click={handleStartLearning}>
			<span class="button__text">Хочу учиться</span>
			<span class="button__icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 40 40"
					fill="none"
				>
					<path
						d="M33.94 21.1783C34.2525 20.8658 34.428 20.4419 34.428 20C34.428 19.5581 34.2525 19.1342 33.94 18.8217L24.5117 9.39334C24.3579 9.23415 24.174 9.10718 23.9707 9.01983C23.7673 8.93248 23.5486 8.88651 23.3273 8.88458C23.106 8.88266 22.8866 8.92483 22.6817 9.00863C22.4769 9.09243 22.2908 9.21619 22.1343 9.37268C21.9779 9.52916 21.8541 9.71525 21.7703 9.92008C21.6865 10.1249 21.6443 10.3444 21.6462 10.5657C21.6482 10.787 21.6941 11.0057 21.7815 11.209C21.8688 11.4123 21.9958 11.5963 22.155 11.75L28.7383 18.3333L6.66667 18.3333C6.22464 18.3333 5.80072 18.5089 5.48816 18.8215C5.1756 19.1341 5 19.558 5 20C5 20.442 5.1756 20.866 5.48816 21.1785C5.80072 21.4911 6.22464 21.6667 6.66667 21.6667L28.7383 21.6667L22.155 28.25C21.8514 28.5643 21.6834 28.9853 21.6872 29.4223C21.691 29.8593 21.8663 30.2774 22.1753 30.5864C22.4843 30.8954 22.9023 31.0707 23.3393 31.0745C23.7763 31.0783 24.1973 30.9103 24.5117 30.6067L33.94 21.1783Z"
						fill="black"
					/>
				</svg>
			</span>
		</button>
	</div>
	<div class="platform__video animate-scale-in">
		<div class="video hover-scale">
			<img src="/images/avatar_1.png" alt="avatar_1" />
		</div>
	</div>
</section>

<style>
	.platform {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 50px;
		padding: 60px 45px;

		border-radius: 20px;
		background: #f3f6ff url(/images/bg_platform.svg) no-repeat;
		background-size: 100%;

		overflow: hidden;
	}

	.platform__info {
		display: flex;
		flex-direction: column;
		gap: 50px;
	}

	.platform__heading {
		font-size: 45px;
		font-weight: 600;
		line-height: 1.15;
	}

	.platform__description {
		max-width: 400px;
		font-size: 16px;
		font-weight: 400;
		color: #393939;
	}

	.button {
		max-width: 460px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40px 7px 40px 24px;

		color: var(--color-white);
		background: var(--color-primary);
		border-radius: 20px;
		font-size: 20px;
		font-weight: 600;
		cursor: pointer;
	}

	.button__text {
		margin-left: 30%;
	}

	.button__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 70px;
		height: 70px;

		background: var(--color-grey);
		border-radius: 20px;
	}

	.video {
		position: relative;
		width: 646px;
		height: 513px;

		background-color: #e0e4ee;
		border-radius: 20px;

		overflow: hidden;
	}

	.video img {
		position: absolute;
		right: 50px;
	}
</style>
