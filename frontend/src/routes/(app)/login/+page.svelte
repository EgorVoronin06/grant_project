<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/form/Button.svelte';
	import NcCodeInput from '$lib/components/form/NCCodeInput.svelte';
	import { ApiError } from '$lib/plugins/api';
	import { AuthApi } from '$lib/plugins/api/modules/auth';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { notification } from '$lib/stores/notifyStore';

	let dto = {
		email: '',
		password: ''
	};

	let loading = false;
	let authInstanceApi: AuthApi;

	onMount(() => {
		authInstanceApi = new AuthApi(fetch);
	});

	async function handleLogin() {
		if (!dto.email || !dto.password) {
			notification.error('Заполните все поля');
			return;
		}

		loading = true;
		try {
			const response = await fetch('http://localhost:3001/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: dto.email,
					password: dto.password
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Ошибка входа');
			}

			// Сохраняем токен
			if (data.token) {
				localStorage.setItem('authToken', data.token);
			}

			notification.success('Вход выполнен успешно!');
			goto('/lk/courses');
		} catch (error) {
			if (error instanceof ApiError) {
				notification.error(error.message);
			} else if (error instanceof Error) {
				notification.error(error.message);
			} else {
				notification.error('Ошибка входа');
			}
		} finally {
			loading = false;
		}
	}

	function handleRegister() {
		goto('/register');
	}
</script>

<div class="login-page container animate-fade-in">
	<div class="login-card">
		<h2 class="login-title">Вход в личный кабинет</h2>
		
		<div class="form-group">
			<label class="form-label">Email</label>
			<input
				type="email"
				class="form-input"
				placeholder="ваш email"
				bind:value={dto.email}
				disabled={loading}
			/>
		</div>

		<div class="form-group">
			<label class="form-label">Пароль</label>
			<input
				type="password"
				class="form-input"
				placeholder="ваш пароль"
				bind:value={dto.password}
				disabled={loading}
			/>
		</div>

		<button class="login-button" on:click={handleLogin} disabled={loading}>
			{loading ? 'Вход...' : 'Войти'}
		</button>

		<div class="register-link">
			<p>Нет аккаунта? <a href="/register" on:click|preventDefault={handleRegister}>Зарегистрироваться</a></p>
		</div>
	</div>
</div>

<style>
	.login-page {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 70vh;
		padding: 40px 20px;
	}

	.login-card {
		width: 100%;
		max-width: 500px;
		background: white;
		border-radius: 32px;
		padding: 50px 40px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.login-card:hover {
		box-shadow: 0 12px 48px rgba(0, 119, 255, 0.15);
		transform: translateY(-4px);
	}

	.login-title {
		font-size: 32px;
		font-weight: 700;
		margin-bottom: 32px;
		text-align: center;
		color: var(--color-dark);
	}

	.form-group {
		margin-bottom: 24px;
	}

	.form-label {
		display: block;
		margin-bottom: 8px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-dark);
	}

	.form-input {
		width: 100%;
		padding: 16px 24px;
		border: 2px solid #b7b5b5;
		border-radius: 32px;
		font-size: 16px;
		transition: all 0.3s ease;
		box-sizing: border-box;
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(0, 119, 255, 0.1);
	}

	.login-button {
		width: 100%;
		padding: 16px 32px;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: 32px;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-top: 8px;
	}

	.login-button:hover:not(:disabled) {
		background: #0056cc;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 119, 255, 0.3);
	}

	.login-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.register-link {
		margin-top: 24px;
		text-align: center;
		font-size: 14px;
		color: var(--color-dark);
	}

	.register-link a {
		color: var(--color-primary);
		text-decoration: none;
		font-weight: 600;
		transition: color 0.3s ease;
	}

	.register-link a:hover {
		color: #0056cc;
		text-decoration: underline;
	}
</style>
